import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export function AlumniList({ alumni }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Alumni</TableHead>
            <TableHead>Education</TableHead>
            <TableHead>Career</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alumni.map((alum) => (
            <TableRow key={alum.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>{alum.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{alum.name}</p>
                    <p className="text-sm text-muted-foreground">Class of {alum.graduationYear}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p>{alum.degree}</p>
              </TableCell>
              <TableCell>
                <p className="font-medium">{alum.position}</p>
                <p className="text-sm text-muted-foreground">{alum.company}</p>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {alum.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                  {alum.skills.length > 3 && (
                    <Badge variant="outline">+{alum.skills.length - 3}</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/alumni/${alum.id}`}>View Profile</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
