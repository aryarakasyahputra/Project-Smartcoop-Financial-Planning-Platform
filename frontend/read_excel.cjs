const XLSX = require('xlsx');
const workbook = XLSX.readFile('c:\\Users\\LENOVO\\Project-Smartcoop-Financial-Planning-Platform\\Smartcoop_Financial_Model_v2 (1).xlsx');
const sheetName = '04_Revenue_Engine';
if (workbook.Sheets[sheetName]) {
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    data.slice(0, 30).forEach(row => console.log(row.join(' | ')));
} else {
    console.log("Sheet not found");
}
