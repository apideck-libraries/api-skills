# File Storage API Reference

Base namespace: `apideck.fileStorage`

Supported connectors: Box, Dropbox, Google Drive, OneDrive, SharePoint.

## Files

```typescript
// List files in a folder
const { data } = await apideck.fileStorage.files.list({
  serviceId: "google-drive",
  filter: {
    folder_id: "folder_123",
    drive_id: "drive_456",
  },
  sort: { by: "updated_at", direction: "desc" },
});

// Search files
const { data } = await apideck.fileStorage.files.search({
  serviceId: "google-drive",
  filesSearch: {
    query: "quarterly report",
  },
});

// Get file metadata
const { data } = await apideck.fileStorage.files.get({
  id: "file_123",
  serviceId: "google-drive",
});

// Upload a file
const { data } = await apideck.fileStorage.files.create({
  serviceId: "google-drive",
  createFileRequest: {
    name: "report.pdf",
    parent_folder_id: "folder_123",
    drive_id: "drive_456",
    description: "Q3 financial report",
  },
});

// Download a file
const { data } = await apideck.fileStorage.files.download({
  id: "file_123",
  serviceId: "google-drive",
});

// Update file metadata
const { data } = await apideck.fileStorage.files.update({
  id: "file_123",
  serviceId: "google-drive",
  updateFileRequest: {
    name: "report-v2.pdf",
    description: "Updated Q3 report",
  },
});

// Delete file
await apideck.fileStorage.files.delete({
  id: "file_123",
  serviceId: "google-drive",
});
```

Key file fields: `id`, `name`, `description`, `mime_type`, `size`, `parent_folders[]`, `owner`, `permissions[]`, `downloadable`, `exportable`, `created_at`, `updated_at`.

## Folders

```typescript
// Get folder contents
const { data } = await apideck.fileStorage.folders.get({
  id: "folder_123",
  serviceId: "dropbox",
});

// Create folder
const { data } = await apideck.fileStorage.folders.create({
  serviceId: "dropbox",
  createFolderRequest: {
    name: "Project Documents",
    parent_folder_id: "folder_root",
    drive_id: "drive_123",
  },
});

// Update folder
const { data } = await apideck.fileStorage.folders.update({
  id: "folder_123",
  serviceId: "dropbox",
  updateFolderRequest: {
    name: "Project Docs - Archived",
  },
});

// Copy folder
const { data } = await apideck.fileStorage.folders.copy({
  id: "folder_123",
  serviceId: "dropbox",
  copyFolderRequest: {
    parent_folder_id: "folder_destination",
    name: "Project Documents (Copy)",
  },
});

// Delete folder
await apideck.fileStorage.folders.delete({
  id: "folder_123",
  serviceId: "dropbox",
});
```

## Shared Links

```typescript
// List shared links
const { data } = await apideck.fileStorage.sharedLinks.list({
  serviceId: "box",
});

// Create shared link
const { data } = await apideck.fileStorage.sharedLinks.create({
  serviceId: "box",
  sharedLink: {
    target: { id: "file_123", type: "file" },
    scope: "company",
    password: "secure-password",
    expires_at: "2024-12-31T23:59:59.000Z",
  },
});

// Delete shared link
await apideck.fileStorage.sharedLinks.delete({
  id: "link_123",
  serviceId: "box",
});
```

Shared link scopes: `public`, `company`, `password`.

## Upload Sessions (large files)

For files larger than the direct upload limit, use chunked upload sessions:

```typescript
// 1. Create upload session
const { data: session } = await apideck.fileStorage.uploadSessions.create({
  serviceId: "box",
  createUploadSessionRequest: {
    name: "large-backup.zip",
    parent_folder_id: "folder_123",
    size: 104857600, // 100MB in bytes
  },
});

// 2. Upload parts (SDK handles chunking)
await apideck.fileStorage.uploadSessions.upload({
  id: session.id,
  serviceId: "box",
  // file part data
});

// 3. Finish upload session
const { data: file } = await apideck.fileStorage.uploadSessions.finish({
  id: session.id,
  serviceId: "box",
});
```

## Drives

```typescript
// List drives
const { data } = await apideck.fileStorage.drives.list({
  serviceId: "google-drive",
});

// Create drive (shared drives)
const { data } = await apideck.fileStorage.drives.create({
  serviceId: "google-drive",
  drive: {
    name: "Engineering Shared Drive",
    description: "Shared documents for the engineering team",
  },
});
```

## Drive Groups (SharePoint only)

```typescript
const { data } = await apideck.fileStorage.driveGroups.list({
  serviceId: "sharepoint",
});
```
