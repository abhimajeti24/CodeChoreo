import fs from 'fs';
import path from 'path';

export const readFileContent = (filePath: string): string | null => {
    try {
        if (!fs.existsSync(filePath)) {
            return null;
        }
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.error('Error reading file:', error);
        return null;
    }
}; 