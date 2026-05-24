import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";

const GENDER_LABELS = { M: "Masculino", F: "Feminino" };

const Profile = () => {
  const [profile, setProfile] = useState({});

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [clothingSize, setClothingSize] = useState('');

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [editing, setEditing] = useState(false);

  const URL_PROFILE = 'http://localhost:8000/race/api/profile/';
  const URL_USER = 'http://localhost:8000/race/api/user/';

  const getCSRFToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
  };

  const getUser = () => {
    axios.get(URL_USER, { withCredentials: true })
      .then(res => {
        setFirstName(res.data.first_name || '');
        setLastName(res.data.last_name || '');
      })
      .catch(err => console.error('Failed to get user:', err));
  };

  const getProfile = () => {
    axios.get(URL_PROFILE, { withCredentials: true })
      .then(res => {
        setProfile(res.data);
        setBirthDate(res.data.birthDate || '');
        setPhoneNumber(res.data.phoneNumber || '');
        setGender(res.data.gender || '');
        setClothingSize(res.data.clothingSize || '');
      })
      .catch(err => console.error('Failed to load profile:', err));
  };

  useEffect(() => {
    getUser();
    getProfile();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(URL_PROFILE,
      { first_name: firstName, last_name: lastName, birthDate, phoneNumber, gender, clothingSize },
      {
        headers: { 'X-CSRFToken': getCSRFToken() },
        withCredentials: true
      }
    )
      .then(() => {
        getUser();
        getProfile();
        setEditing(false);
      })
      .catch((err) => console.log('Profile update failed...', err.response));
  };

  const handleImageSelection = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setImage(null);
      setPreviewUrl('');
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (image) {
      const updatedProfile = { ...profile, image: image };
      axios.put(URL_PROFILE, updatedProfile, {
        headers: {
          'X-CSRFToken': getCSRFToken(),
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      })
        .then(() => {
          getProfile();
          setImage(null);
          setPreviewUrl('');
        })
        .catch(err => console.error('Failed to update profile:', err));
    }
  };

  return (
    <div className="flex-1 bg-background text-foreground flex items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-6">

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">O meu perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              <img
                src={"http://localhost:8000" + profile.image}
                alt="image"
                className="h-36 w-36 rounded-full object-cover border border-border"
              />
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="text-lg font-medium">{firstName} {lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de nascimento</p>
                  <p className="text-lg font-medium">
                    {birthDate ? birthDate.split('-').reverse().join('-') : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telemóvel</p>
                  <p className="text-lg font-medium">{phoneNumber || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Género</p>
                  <p className="text-lg font-medium">{GENDER_LABELS[gender] || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tamanho de roupa</p>
                  <p className="text-lg font-medium">{clothingSize || "—"}</p>
                </div>
              </div>
            </div>
            <Button onClick={() => setEditing(!editing)}>
              {editing ? "Cancelar edição" : "Editar perfil"}
            </Button>
          </CardContent>
        </Card>

        {editing && (
          <Card>
            <CardHeader>
              <CardTitle>Alterar dados do perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldSet>
                <FieldGroup>
                  <div className="flex gap-4">
                    <Field>
                      <FieldLabel htmlFor="firstName">Nome</FieldLabel>
                      <Input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="lastName">Apelido</FieldLabel>
                      <Input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="birthDate">Data de nascimento</FieldLabel>
                    <Input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="phoneNumber">Telemóvel</FieldLabel>
                    <Input id="phoneNumber" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
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

                  <FieldSeparator />

                  <Field>
                    <FieldLabel htmlFor="profile-image">Imagem de perfil</FieldLabel>
                    <Input
                      id="profile-image"
                      type="file"
                      onChange={handleImageSelection}
                      accept="image/*"
                    />
                  </Field>
                  {previewUrl && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Pré-visualização</p>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-24 w-24 rounded-md object-cover border border-border"
                      />
                    </div>
                  )}
                  {image && (
                    <Button variant="outline" onClick={handleUpload}>
                      Carregar imagem
                    </Button>
                  )}
                </FieldGroup>
                <Button onClick={handleSubmit} className="w-full">Guardar alterações</Button>
              </FieldSet>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
};

export default Profile;
