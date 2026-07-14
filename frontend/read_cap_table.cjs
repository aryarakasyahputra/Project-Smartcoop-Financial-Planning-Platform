const xlsx = require('xlsx');
const workbook = xlsx.readFile('../Smartcoop_Financial_Model_v2 (1).xlsx');
console.log('Sheets:', workbook.SheetNames);
if (workbook.SheetNames.includes('Cap Table')) {
    const ws = workbook.Sheets['Cap Table'];
    console.log(xlsx.utils.sheet_to_json(ws, { header: 1 }));
} else {
    console.log('Checking all sheets for Cap Table...');
    workbook.SheetNames.forEach(name => {
        const ws = workbook.Sheets[name];
        const data = xlsx.utils.sheet_to_json(ws, { header: 1 }).slice(0, 100);
        const found = data.filter(row => row.some(cell => typeof cell === 'string' && cell.toLowerCase().includes('cap table')));
        if (found.length) {
            console.log('Sheet:', name, 'Found:', found);
            console.log('--- Top rows of this sheet ---');
            data.slice(0, 30).forEach(r => console.log(r));
        }
    });
}
