import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Profile = () => {
    const [first_name, setFirst_name] = useState(null);
    const [profile, setProfile] = useState([]);

    const URL_PROFILE = 'http://localhost:8000/race/api/profile/';
    const URL_USER = 'http://localhost:8000/race/api/user/';

    const getUser = () => {
        axios.get(URL_USER, { withCredentials: true })
            .then(res => setFirst_name(res.data.first_name))
            .catch(err => console.error('Failed to get user:', err));
    }

    const getProfile = () => {
        axios.get(URL_PROFILE, { withCredentials: true })
            .then(res => setProfile(res.data))
            .catch(err => console.error('Failed to load profile:', err));
    }

    useEffect(() => {
        getUser();
        getProfile();
    }, []);

    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const handleImageSelection = (e) => {
        e.preventDefault();
        const image = e.target.files[0];
        if (image) {
            setImage(image);
            setPreviewUrl(URL.createObjectURL(image));
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
                .then(() => getProfile())
                .catch(err => console.error('Failed to update profile:', err));
            setPreviewUrl('');
        }
    }

    const getCSRFToken = () => {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];
    }

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
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
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Nome</p>
                                <p className="text-lg font-medium">{first_name}</p>
                            </div>
                        </div>
                        <Button variant="outline" onClick={() => navigate("/")}>
                            Voltar
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Carregar imagem de perfil</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="profile-image">Selecionar ficheiro</Label>
                            <Input
                                id="profile-image"
                                type="file"
                                onChange={handleImageSelection}
                                accept="image/*"
                            />
                        </div>
                        <Button onClick={(e) => handleUpload(e, profile)}>
                            Upload
                        </Button>
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
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Profile;