import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";

const SIGNUP_URL = 'http://localhost:8000/race/api/signup/';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
      .post(SIGNUP_URL, {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        birthDate,
        phoneNumber,
        gender,
        clothingSize,
      })
      .then((response) => {
        console.log('Signup successful!', response.data.msg);
        navigate('/');
      })
      .catch((err) => console.log('Signup failed...', err.response.data.msg));
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-background p-8">
      <Card className="w-full max-w-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Criar conta</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldSet>
            <FieldGroup>
              <div className="flex gap-4">
                <Field>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input id="firstName" type="text" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input id="lastName" type="text" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Field>

              <FieldSeparator />

              <Field>
                <FieldLabel htmlFor="birthDate">Data de nascimento</FieldLabel>
                <Input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
              </Field>

              <Field>
                <FieldLabel htmlFor="phoneNumber">Telemóvel</FieldLabel>
                <Input id="phoneNumber" type="tel" autoComplete="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </Field>

              <Field>
                <FieldLabel>Género</FieldLabel>
                <Select onValueChange={setGender} value={gender}>
                  <SelectTrigger><SelectValue placeholder="Seleciona o género..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Tamanho de roupa</FieldLabel>
                <Select onValueChange={setClothingSize} value={clothingSize}>
                  <SelectTrigger><SelectValue placeholder="Seleciona o tamanho..." /></SelectTrigger>
                  <SelectContent>
                    {["XS", "S", "M", "L", "XL", "2XL"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>

            <Button onClick={handleSubmit} className="w-full">Criar conta</Button>
          </FieldSet>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;