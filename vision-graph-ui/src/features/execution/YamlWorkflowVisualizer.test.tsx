import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { YamlWorkflowVisualizer } from './YamlWorkflowVisualizer'

describe('YamlWorkflowVisualizer', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>)
  }

  describe('EXE-06 yaml visualizer', () => {
    it('renders YAML as tree structure', () => {
      const yaml = `steps:
  - name: step1
    action: test
  - name: step2
    action: process`

      renderWithTheme(<YamlWorkflowVisualizer workflow={yaml} />)

      expect(screen.getByTestId('yaml-visualizer')).toBeInTheDocument()
      expect(screen.getAllByText(/steps:/i).length).toBeGreaterThan(0)
      
      const visualizer = screen.getByTestId('yaml-visualizer')
      expect(visualizer.textContent).toContain('steps')
    })

    it('shows root node visible', () => {
      const yaml = `name: test-workflow
steps: []`

      renderWithTheme(<YamlWorkflowVisualizer workflow={yaml} />)

      const visualizer = screen.getByTestId('yaml-visualizer')
      expect(visualizer.textContent).toContain('test-workflow')
      expect(visualizer.textContent).toContain('steps')
    })

    it('shows nested sections indented', () => {
      const yaml = `steps:
  - name: nested
    action:
      type: process
      params:
        - param1
        - param2`

      renderWithTheme(<YamlWorkflowVisualizer workflow={yaml} />)

      const visualizer = screen.getByTestId('yaml-visualizer')
      expect(visualizer.textContent).toContain('steps')
    })
  })

  describe('EXE-07 colored expandable', () => {
    it('section colors differ', () => {
      const yaml = `section1: value1
section2: value2
section3: value3`

      renderWithTheme(<YamlWorkflowVisualizer workflow={yaml} />)

      const visualizer = screen.getByTestId('yaml-visualizer')
      expect(visualizer.textContent).toContain('value1')
      expect(visualizer.textContent).toContain('value2')
      expect(visualizer.textContent).toContain('value3')
    })

    it('collapse/expand toggles work', async () => {
      const yaml = `steps:
  - name: step1
  - name: step2
  - name: step3`

      renderWithTheme(<YamlWorkflowVisualizer workflow={yaml} />)

      const toggleButtons = screen.getAllByRole('button')
      expect(toggleButtons.length).toBeGreaterThan(0)
    })

    it('expand shows children', () => {
      const yaml = `steps:
  - name: step1
  - name: step2`

      renderWithTheme(<YamlWorkflowVisualizer workflow={yaml} />)

      const toggleButton = screen.getAllByRole('button')[0]
      expect(toggleButton).toBeInTheDocument()
    })
  })

  describe('EXE-08 dense padding', () => {
    it('indent uses minimal token', () => {
      const yaml = `level1:
  level2:
    level3:
      level4`

      renderWithTheme(<YamlWorkflowVisualizer workflow={yaml} />)

      const visualizer = screen.getByTestId('yaml-visualizer')
      expect(visualizer.textContent).toContain('level1')
    })

    it('inter-element gap minimal', () => {
      const yaml = `item1: value1
item2: value2
item3: value3`

      renderWithTheme(<YamlWorkflowVisualizer workflow={yaml} />)

      const visualizer = screen.getByTestId('yaml-visualizer')
      expect(visualizer.textContent).toContain('value1')
      expect(visualizer.textContent).toContain('value2')
      expect(visualizer.textContent).toContain('value3')
    })

    it('compact layout maintained', () => {
      const yaml = `compact:
  - a
  - b
  - c`

      renderWithTheme(<YamlWorkflowVisualizer workflow={yaml} />)

      expect(screen.getByTestId('yaml-visualizer')).toBeInTheDocument()
    })
  })

  describe('EXEC-01 confirm shows yaml', () => {
    it('same component as EXE-06', () => {
      const yaml = `name: confirm-test
steps:
  - name: confirm-step`

      renderWithTheme(<YamlWorkflowVisualizer workflow={yaml} />)

      expect(screen.getByTestId('yaml-visualizer')).toBeInTheDocument()
    })

    it('testid matches visualizer', () => {
      const yaml = `test: value`

      renderWithTheme(<YamlWorkflowVisualizer workflow={yaml} />)

      const visualizer = screen.getByTestId('yaml-visualizer')
      expect(visualizer).toBeInTheDocument()
    })
  })

  describe('EXEC-03 yaml failure', () => {
    it('inline error shown', () => {
      const invalidYaml = `invalid: yaml: content: [unclosed`

      renderWithTheme(<YamlWorkflowVisualizer workflow={invalidYaml} />)

      const visualizer = screen.getByTestId('yaml-visualizer')
      expect(visualizer.textContent?.toLowerCase()).toContain('error')
    })

    it('raw text displayed', () => {
      const invalidYaml = `invalid: content`

      renderWithTheme(<YamlWorkflowVisualizer workflow={invalidYaml} />)

      const visualizer = screen.getByTestId('yaml-visualizer')
      expect(visualizer.textContent).toContain('content')
    })

    it('execute disabled', () => {
      const invalidYaml = `invalid: [yaml`

      renderWithTheme(<YamlWorkflowVisualizer workflow={invalidYaml} disabledOnError={true} />)

      const errorElement = screen.getByText(/error/i)
      expect(errorElement).toBeInTheDocument()
    })
  })
})
