import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from '../../../utils/postgres'; // Update the path as needed
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const csvFilePath = path.join(process.cwd(), 'file.csv'); // Update the path to your CSV file

    const results = await new Promise((resolve, reject) => {
      const data: any = [];
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
          // Trim keys and values for consistent handling
          const trimmedRow: any = {};
          for (const key in row) {
            if (Object.hasOwnProperty.call(row, key)) {
              const trimmedKey = key.trim();
              trimmedRow[trimmedKey] = row[key].trim();
            }
          }
          data.push(trimmedRow);
        })
        .on('end', () => resolve(data))
        .on('error', (error) => reject(error));
    });
    return NextResponse.json({ data: results }, { status: 200 });

    // console.log('Parsed CSV data:', results); // Log the data for debugging

    // const client = await pool.connect();
    // try {
    //   const queryText = `
    //     INSERT INTO suggestions (skill, budget, description)
    //     VALUES ($1, $2, $3) 
    //   `;

    //   // Validate and filter out invalid data
    //   const queryPromises = results
    //     .filter((row) => row['Skills required'] && row.budget && row['Description'])
    //     .map(async (row) => {
    //       console.log('Inserting row:', row['Description']);
    //       return await client.query(queryText, [row['Skills required'], row.budget, row['Description']]);
    //     });

    //   await Promise.all(queryPromises);

    //   console.log('Data successfully inserted into the database');
    //   return NextResponse.json({ message: 'Data successfully inserted into the database' }, { status: 200 });
    // } catch (error) {
    //   console.error('Error inserting data into database', error);
    //   return NextResponse.json({ error: 'Error inserting data into database' }, { status: 500 });
    // } finally {
    //   client.release();
    // }
  } catch (error) {
    console.error('Error reading CSV file:', error);
    return NextResponse.json({ error: 'Error reading CSV file' }, { status: 500 });
  }
}



export async function GET() {
  const filePath = path.join(process.cwd(), "src", 'lib', 'business-models.txt');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  console.log(fileContent, "Got the file");


  const businessModels = fileContent.split('\n').map(line => {
    const [name, description, skills] = line.split('|');
    return {
      name,
      description,
      requiredSkills: skills.split(',').map(skill => skill.trim())
    };
  });

  return NextResponse.json(businessModels);
}