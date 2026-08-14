---
id: 213e4567-e89b-12d3-a456-426614174018
title: Data Export
parent: index.md
children:
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: done
focus_jump:
---

# Data Export

Data export capabilities transform local-first principles from theoretical ideals into practical user benefits. When users can easily export their data in standard formats, they gain true ownership and the freedom to switch between services, self-host their data, or create backups without depending on the continued existence of any particular company or service.

Effective data export goes beyond simple file downloads. It requires thoughtful consideration of data formats, completeness of exports, usability of exported data, and ongoing maintenance as the application evolves. The best export capabilities feel like a natural feature of the application, not a regulatory compliance exercise.

## Export Design Principles

### Completeness
- **All user data**: Documents, settings, preferences, metadata
- **Relationships preserved**: Links and associations between items
- **Historical data**: Version history and change logs
- **Media files**: Images, attachments, and embedded content

### Usability
- **Standard formats**: JSON, CSV, Markdown, SQLite
- **Human-readable**: Text-based formats when possible
- **Well-documented**: Clear schema and structure documentation
- **Importable**: Can be imported back into the application

### Reliability
- **Consistent**: Same data produces same export
- **Verifiable**: Checksums and validation
- **Tested**: Regular testing of export functionality
- **Supported**: Help users with export issues

## Implementation Patterns

### Incremental Export
```javascript
class DataExporter {
  async exportFull(userId) {
    const export = {
      metadata: this.createMetadata(),
      user: await this.exportUser(userId),
      documents: await this.exportDocuments(userId),
      settings: await this.exportSettings(userId),
      relationships: await this.exportRelationships(userId)
    };

    return this.validateAndPackage(export);
  }

  async exportIncremental(userId, sinceDate) {
    return {
      metadata: this.createMetadata({ type: 'incremental', since: sinceDate }),
      changes: await this.getChangesSince(userId, sinceDate)
    };
  }

  createMetadata(options = {}) {
    return {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      applicationVersion: PACKAGE_VERSION,
      ...options
    };
  }
}
```

### Format Selection
- **JSON**: Structured data, relationships, metadata
- **Markdown**: Documents, notes, rich text
- **CSV**: Tabular data, spreadsheets
- **SQLite**: Complete database export
- **ZIP**: Combined export with multiple files

## Export Features

### Export Options
- **Full export**: All user data
- **Incremental export**: Changes since last export
- **Selective export**: Specific data types or date ranges
- **Scheduled export**: Automatic recurring exports

### Destination Options
- **Local download**: Direct file download
- **Cloud storage**: Export to Google Drive, Dropbox, etc.
- **Email**: Send export as email attachment
- **WebDAV**: Upload to personal cloud storage

### Post-Export Processing
- **Compression**: Reduce file size for large exports
- **Encryption**: Password-protect sensitive exports
- **Splitting**: Divide large exports into manageable files
- **Verification**: Confirm export integrity

## User Experience

### Discovery and Access
- **Prominent placement**: Export options in settings
- **Clear labeling**: Obvious export functionality
- **Progress indication**: Show export progress for large datasets
- **Completion notification**: Alert when export is ready

### Error Handling
- **Clear error messages**: Explain what went wrong
- **Recovery options**: Retry or partial export
- **Support access**: Link to help documentation
- **Fallback options**: Alternative export methods

## Technical Challenges

### Large Datasets
- **Memory management**: Stream exports, avoid loading everything
- **Performance**: Background processing, progress updates
- **Timeout handling**: Long-running exports
- **Resource limits**: Work within platform constraints

### Schema Evolution
- **Versioning**: Track export format versions
- **Migration**: Support importing old export formats
- **Backward compatibility**: New versions read old exports
- **Deprecation**: Phased removal of old formats

### Data Integrity
- **Validation**: Verify exported data matches source
- **Completeness**: Ensure nothing is missing
- **Consistency**: Maintain data relationships
- **Security**: Protect sensitive data during export

## Best Practices

- **Test regularly**: Verify exports work with real user data
- **Document formats**: Public schema documentation
- **Provide samples**: Example export files
- **Support migration**: Help users import from other services
- **Monitor usage**: Track export patterns and issues

## Legal and Regulatory

- **GDPR compliance**: Right to data portability
- **Response time**: Provide exports within legal timeframes
- **Format requirements**: Use machine-readable standard formats
- **Access verification**: Authenticate export requests

> The true test of data ownership isn't whether users can access their data—it's whether they can leave with it.