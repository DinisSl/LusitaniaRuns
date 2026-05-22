import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SIGNUP_URL = 'http://localhost:8000/race/api/signup/';

const Signup = () => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [clothingSize, setClothingSize] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(SIGNUP_URL, { first_name, last_name, email, password, birthDate, phoneNumber, gender, clothingSize })
      .then((response) => {
        console.log('Signup successful!', response.data.msg);
        navigate('/');
      })
      .catch((err) => console.log('Signup failed...', err.response.data.msg));
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Signup</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor="first_name">First name:</Label>
                <Input id="first_name" type="text" value={first_name} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="last_name">Last name:</Label>
                <Input id="last_name" type="text" value={last_name} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email:</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password:</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth date:</Label>
              <Input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone number:</Label>
              <Input id="phoneNumber" type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Gender:</Label>
              <Select onValueChange={setGender} value={gender}>
                <SelectTrigger><SelectValue placeholder="Select gender..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Clothing size:</Label>
              <Select onValueChange={setClothingSize} value={clothingSize}>
                <SelectTrigger><SelectValue placeholder="Select size..." /></SelectTrigger>
                <SelectContent>
                  {["XS","S","M","L","XL","2XL"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full mt-2">Signup</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;