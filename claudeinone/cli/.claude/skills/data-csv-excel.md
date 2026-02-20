# CSV & Excel Processing

Reading, writing, and manipulating spreadsheet files.

## CSV Handling

```typescript
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';
import fs from 'fs';

// Read CSV
const parser = fs.createReadStream('data.csv')
  .pipe(parse({
    columns: true,
    skip_empty_lines: true,
    trim: true
  }));

const records: any[] = [];
for await (const record of parser) {
  records.push(record);
}

console.log(records);

// Write CSV
const output = fs.createWriteStream('output.csv');
const stringifier = stringify({
  columns: ['id', 'name', 'email'],
  header: true
});

stringifier.pipe(output);

records.forEach(record => {
  stringifier.write({
    id: record.id,
    name: record.name,
    email: record.email
  });
});

stringifier.end();
```

## Excel Files (XLSX)

```typescript
import ExcelJS from 'exceljs';

// Read Excel
const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile('data.xlsx');

const worksheet = workbook.getWorksheet(1);
const rows: any[] = [];

worksheet.eachRow((row, rowNumber) => {
  if (rowNumber > 1) { // Skip header
    rows.push({
      id: row.getCell(1).value,
      name: row.getCell(2).value,
      email: row.getCell(3).value
    });
  }
});

// Write Excel
const newWorkbook = new ExcelJS.Workbook();
const newWorksheet = newWorkbook.addWorksheet('Data');

// Add headers
newWorksheet.columns = [
  { header: 'ID', key: 'id', width: 10 },
  { header: 'Name', key: 'name', width: 30 },
  { header: 'Email', key: 'email', width: 40 }
];

// Add data
rows.forEach(row => {
  newWorksheet.addRow(row);
});

// Style
newWorksheet.getRow(1).font = { bold: true };
newWorksheet.getRow(1).fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFD3D3D3' }
};

await newWorkbook.xlsx.writeFile('output.xlsx');
```

## Data Transformation

```typescript
// Pipeline for data processing
async function processImport(filePath: string) {
  const records = await readCSV(filePath);

  // Transform
  const transformed = records
    .map(record => ({
      ...record,
      email: record.email.toLowerCase().trim(),
      name: record.name.toUpperCase(),
      createdAt: new Date()
    }))
    .filter(record => record.email.includes('@'))
    .filter((record, index, arr) =>
      arr.findIndex(r => r.email === record.email) === index
    ); // Deduplicate

  // Validate
  const validated = transformed.filter(record => {
    const errors: string[] = [];

    if (!record.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.push('Invalid email');
    }

    if (record.name.length < 2) {
      errors.push('Name too short');
    }

    if (errors.length > 0) {
      console.warn(`Row invalid: ${errors.join(', ')}`);
      return false;
    }

    return true;
  });

  // Store in database
  await db.users.createMany(validated);

  return {
    total: records.length,
    valid: validated.length,
    invalid: records.length - validated.length
  };
}
```

## Streaming Large Files

```typescript
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';

// Stream processing for large files
async function processLargeCSV(filePath: string) {
  const stream = createReadStream(filePath)
    .pipe(parse({ columns: true, batchSize: 1000 }));

  for await (const records of stream) {
    // Process batch of 1000 records
    await db.users.createMany(records);
    console.log(`Processed ${records.length} records`);
  }
}
```

## Excel with Formulas

```typescript
import ExcelJS from 'exceljs';

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Summary');

// Data
worksheet.columns = [
  { header: 'Item', key: 'item' },
  { header: 'Price', key: 'price' },
  { header: 'Quantity', key: 'quantity' },
  { header: 'Total', key: 'total' }
];

worksheet.addRows([
  { item: 'Widget', price: 10, quantity: 5, total: '=B2*C2' },
  { item: 'Gadget', price: 20, quantity: 3, total: '=B3*C3' }
]);

// Add summary row
worksheet.addRow({
  item: 'Total',
  price: null,
  quantity: '=SUM(C2:C3)',
  total: '=SUM(D2:D3)'
});

await workbook.xlsx.writeFile('report.xlsx');
```

## Best Practices

✅ **Stream large files** - Avoid loading entire file in memory
✅ **Validate data** - Check before storing
✅ **Batch operations** - Process in chunks
✅ **Error handling** - Log invalid rows
✅ **Consistent format** - Normalize data during import

## Resources

- [csv-parse Documentation](https://csv.js.org/parse/)
- [ExcelJS](https://github.com/exceljs/exceljs)
- [SheetJS](https://sheetjs.com/)
