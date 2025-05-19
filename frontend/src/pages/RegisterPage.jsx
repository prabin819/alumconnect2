import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  Select,
} from '@/components/ui/select';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RegisterPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Common fields for both user types
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  // Alumni-specific fields
  const [graduationYear, setGraduationYear] = useState('');
  const [degree, setDegree] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [industry, setIndustry] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [skills, setSkills] = useState('');

  // Student-specific fields
  const [enrollmentYear, setEnrollmentYear] = useState('');
  const [expectedGraduationYear, setExpectedGraduationYear] = useState('');
  const [major, setMajor] = useState('');
  const [studentId, setStudentId] = useState('');
  const [interests, setInterests] = useState('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - 15 + i);

  const handleAlumniSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Alumni-specific validation
    if (!graduationYear || !degree) {
      setError('Graduation year and degree are required');
      return;
    }

    try {
      setIsSubmitting(true);

      const userData = {
        email,
        password,
        name,
        bio,
        userType: 'Alumni',
        graduationYear: parseInt(graduationYear),
        degree,
        company,
        position,
        industry,
        linkedIn,
        skills: skills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      // Call your API here
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(userData),
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Registration failed');
      // }

      // Mock API call success
      console.log('Alumni registration data:', userData);
      setSuccess('Registration successful! Check your email to verify your account.');

      // Redirect after successful registration
      // setTimeout(() => window.location.href = '/login', 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Student-specific validation
    if (!enrollmentYear || !expectedGraduationYear || !major || !studentId) {
      setError('All student fields are required');
      return;
    }

    try {
      setIsSubmitting(true);

      const userData = {
        email,
        password,
        name,
        bio,
        userType: 'Student',
        enrollmentYear: parseInt(enrollmentYear),
        expectedGraduationYear: parseInt(expectedGraduationYear),
        major,
        studentId,
        interests: interests
          .split(',')
          .map((interest) => interest.trim())
          .filter(Boolean),
      };

      // Call your API here
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(userData),
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Registration failed');
      // }

      // Mock API call success
      console.log('Student registration data:', userData);
      setSuccess('Registration successful! Check your email to verify your account.');

      // Redirect after successful registration
      // setTimeout(() => window.location.href = '/login', 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>Choose the account type that fits your needs</CardDescription>
        </CardHeader>

        <Tabs defaultValue="alumni" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 mx-4">
            <TabsTrigger value="alumni">Alumni</TabsTrigger>
            <TabsTrigger value="student">Student</TabsTrigger>
          </TabsList>

          {/* Alumni Registration Form */}
          <TabsContent value="alumni">
            <form onSubmit={handleAlumniSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Personal Information</h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="alumni-name">Full Name</Label>
                      <Input
                        id="alumni-name"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alumni-email">Email Address</Label>
                      <Input
                        id="alumni-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alumni-password">Password</Label>
                      <Input
                        id="alumni-password"
                        type="password"
                        placeholder="Create a password (min. 8 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alumni-confirm-password">Confirm Password</Label>
                      <Input
                        id="alumni-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alumni-bio">Bio (Optional)</Label>
                    <Textarea
                      id="alumni-bio"
                      placeholder="Tell us about yourself"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Alumni Information</h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="alumni-graduation-year">Graduation Year</Label>
                      <Select value={graduationYear} onValueChange={setGraduationYear} required>
                        <SelectTrigger id="alumni-graduation-year">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alumni-degree">Degree</Label>
                      <Input
                        id="alumni-degree"
                        placeholder="e.g., Bachelor of Science in Computer Science"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alumni-company">Current Company (Optional)</Label>
                      <Input
                        id="alumni-company"
                        placeholder="Where do you work?"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alumni-position">Position (Optional)</Label>
                      <Input
                        id="alumni-position"
                        placeholder="Your job title"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alumni-industry">Industry (Optional)</Label>
                      <Input
                        id="alumni-industry"
                        placeholder="e.g., Technology, Healthcare, Finance"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alumni-linkedin">LinkedIn Profile (Optional)</Label>
                      <Input
                        id="alumni-linkedin"
                        placeholder="Your LinkedIn URL"
                        value={linkedIn}
                        onChange={(e) => setLinkedIn(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alumni-skills">Skills (Optional, comma-separated)</Label>
                    <Textarea
                      id="alumni-skills"
                      placeholder="e.g., Project Management, Data Analysis, JavaScript"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Registering...' : 'Register as Alumni'}
                </Button>

                <p className="text-center text-sm text-gray-500">
                  Already have an account?{' '}
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => (window.location.href = '/login')}
                  >
                    Log in
                  </Button>
                </p>
              </CardFooter>
            </form>
          </TabsContent>

          {/* Student Registration Form */}
          <TabsContent value="student">
            <form onSubmit={handleStudentSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Personal Information</h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="student-name">Full Name</Label>
                      <Input
                        id="student-name"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="student-email">Email Address</Label>
                      <Input
                        id="student-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="student-password">Password</Label>
                      <Input
                        id="student-password"
                        type="password"
                        placeholder="Create a password (min. 8 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="student-confirm-password">Confirm Password</Label>
                      <Input
                        id="student-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-bio">Bio (Optional)</Label>
                    <Textarea
                      id="student-bio"
                      placeholder="Tell us about yourself"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Student Information</h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="student-id">Student ID</Label>
                      <Input
                        id="student-id"
                        placeholder="Your university ID number"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="student-major">Major</Label>
                      <Input
                        id="student-major"
                        placeholder="Your field of study"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="student-enrollment-year">Enrollment Year</Label>
                      <Select value={enrollmentYear} onValueChange={setEnrollmentYear} required>
                        <SelectTrigger id="student-enrollment-year">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="student-graduation-year">Expected Graduation Year</Label>
                      <Select
                        value={expectedGraduationYear}
                        onValueChange={setExpectedGraduationYear}
                        required
                      >
                        <SelectTrigger id="student-graduation-year">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-interests">Interests (Optional, comma-separated)</Label>
                    <Textarea
                      id="student-interests"
                      placeholder="e.g., Artificial Intelligence, Web Development, Data Science"
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Registering...' : 'Register as Student'}
                </Button>

                <p className="text-center text-sm text-gray-500">
                  Already have an account?{' '}
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => (window.location.href = '/login')}
                  >
                    Log in
                  </Button>
                </p>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default RegisterPage;
