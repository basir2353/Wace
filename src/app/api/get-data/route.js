import { pool } from '../../../utils/postgres'; // Update the path as needed
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { skill, budget } = await req.json(); // Parse JSON body

    if (!skill || !budget) {
      return NextResponse.json({ error: 'Skill and budget are required', status: 400  }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      const queryText = `
        SELECT description 
        FROM suggestions 
        WHERE skill = $1 AND budget = $2
      `;
      
      const result = await client.query(queryText, [skill, budget]);

      if (result.rows.length === 0) {
        return NextResponse.json({ message: 'No matching records found' , status: 404 }, { status: 404 });
      }

      return NextResponse.json(result.rows[0], { status: 200 });
    } catch (error) {
      console.error('Error querying database:', error);
      return NextResponse.json({ error: 'Error querying database',status: 500  }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Error processing request', status: 500  }, { status: 500 });
  }
}
