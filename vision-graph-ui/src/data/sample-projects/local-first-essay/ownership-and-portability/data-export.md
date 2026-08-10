---
id: a9b0c1d2-e3f4-5678-2345-789012345678
title: Data Export
parent: ./index.md
children:
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: done
focus_jump:
---

# Data Export

Data export capabilities ensure users can retrieve their data in usable formats, enabling platform migration and backup strategies.

## Export Strategies

### Full Export
Complete user data export:
```javascript
async function fullExport(userId) {
  const exportData = {
    user: await getUserData(userId),
    documents: await getAllDocuments(userId),
    settings: await getAllSettings(userId),
    metadata: {
      exportDate: new Date().toISOString(),
      version: '2.0',
      format: 'local-first-export'
    }
  }
  
  return createExportFile(exportData)
}
```

### Partial Export
Selective data export:
- **Date Range**: Export data from specific time period
- **Content Types**: Export only documents, settings, etc.
- **Tags/Categories**: Export filtered by labels
- **Search Results**: Export matching search criteria

### Incremental Export
Export only changes since last export:
```javascript
async function incrementalExport(userId, lastExportDate) {
  const changes = await getChangesSince(userId, lastExportDate)
  return {
    type: 'incremental',
    baseDate: lastExportDate,
    changes: changes,
    exportDate: new Date().toISOString()
  }
}
```

## Export Formats

### JSON Format
Structured, machine-readable:
```json
{
  "version": "2.0",
  "exportDate": "2026-08-09T00:00:00Z",
  "user": {
    "id": "user-123",
    "profile": { "name": "Alice", "email": "alice@example.com" }
  },
  "documents": [
    {
      "id": "doc-456",
      "title": "Research Notes",
      "content": "# Research\n\nKey findings...",
      "metadata": {
        "created": "2026-08-01T10:00:00Z",
        "modified": "2026-08-09T15:30:00Z"
      }
    }
  ]
}
```

### Markdown Format
Human-readable, version control friendly:
```markdown
# User Data Export

**User:** Alice (alice@example.com)
**Export Date:** 2026-08-09T00:00:00Z

## Documents

### Research Notes

*Created: 2026-08-01T10:00:00Z*
*Modified: 2026-08-09T15:30:00Z*

# Research

Key findings...
```

### CSV Format
Tabular data export:
```csv
id,title,created,modified,tags
doc-456,Research Notes,2026-08-01T10:00:00Z,2026-08-09T15:30:00Z,"research,notes"
doc-789,Project Plan,2026-08-05T14:20:00Z,2026-08-08T09:15:00Z,"planning,project"
```

## Export Process

### User Interface
Intuitive export workflow:
1. **Export Options**: Select format and scope
2. **Preview**: Show what will be exported
3. **Progress**: Real-time export progress
4. **Download**: Automatic file download
5. **Confirmation**: Export completion notification

### Background Processing
Large exports in background:
- **Progress Tracking**: Real-time status updates
- **Cancellation**: Ability to cancel long exports
- **Resumability**: Resume interrupted exports
- **Email Notification**: Send download link when complete

## Data Integrity

### Validation
Ensure export quality:
```javascript
function validateExport(exportData) {
  const errors = []
  
  if (!exportData.version) {
    errors.push('Missing version information')
  }
  
  if (!exportData.exportDate) {
    errors.push('Missing export date')
  }
  
  exportData.documents?.forEach((doc, index) => {
    if (!doc.id) errors.push(`Document ${index} missing ID`)
    if (!doc.title) errors.push(`Document ${index} missing title`)
  })
  
  return errors
}
```

### Checksums
Verify export integrity:
```javascript
async function createChecksum(file) {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
```

## Import Compatibility

### Reverse Engineering
Export format enables import:
- **Schema Documentation**: Clear format specification
- **Migration Guides**: Step-by-step import instructions
- **Validation Tools**: Verify import data integrity
- **Conflict Resolution**: Handle data conflicts during import

### Platform Interoperability
Cross-platform data sharing:
- **Standard Formats**: JSON, CSV, Markdown
- **API Compatibility**: REST endpoints for import/export
- **Third-Party Tools**: Support for external migration tools
- **Community Support**: Open-source import/export utilities

Effective data export transforms local-first applications from walled gardens into open platforms that respect user autonomy.