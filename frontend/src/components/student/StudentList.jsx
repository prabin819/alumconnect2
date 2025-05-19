import { Link } from 'react-router-dom';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export function StudentList({ students }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Major</TableHead>
            <TableHead>Years</TableHead>
            <TableHead>Interests</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>{student.studentId}</TableCell>
              <TableCell>{student.major}</TableCell>
              <TableCell>
                {student.enrollmentYear} - {student.expectedGraduationYear}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {student.interests.slice(0, 3).map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                  {student.interests.length > 3 && (
                    <Badge variant="outline">+{student.interests.length - 3}</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/students/${student.id}`}>View Profile</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
