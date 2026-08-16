Feature: Make Folder transformation + FS action
  As usr working with selected nodes
  I want Make Folder action to transform group visually
  I want Make Folder action to create folder structure in filesystem
  So soft groups can become persistent hard groups

  Scenario: Make Folder visual transformation
    Given soft group selected with + icon menu open
    When usr selects "Make Folder" action
    Then selection halo border becomes more pronounced and harsher
    And halo border stays about the same size
    And center of border glow becomes more solid
    And center of border glow becomes less opaque
    And group type changes from soft to hard

  Scenario: Make Folder file system action
    Given soft group selected and "Make Folder" action invoked
    When Make Folder completes
    Then all selected files and folders moved into new folder
    And new blank node .md doc created at top level
    And new node has selection active
    And group becomes hard group (folder-based)
    And FS action asserts via spy divs (folder-create-spy/file-move-spy)
