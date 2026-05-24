from django.db import models
from django.contrib.auth.models import User

class Race(models.Model):
    name = models.CharField(max_length=200)
    date = models.DateTimeField('Data e hora da corrida')
    location = models.CharField(max_length=200)
    image = models.ImageField(upload_to='race_pics', default='default.png')
    details = models.TextField(max_length=2000, null=True, blank=True)

    def __str__(self):
        return self.name


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='profile_pics', default='default.png')
    birthDate = models.DateField()
    phoneNumber = models.CharField(max_length=20)

    GENDER_CHOICES = (
        ("M", "Masculino"),
        ("F", "Feminino")
    )

    CLOTHING_SIZE_CHOICES = (
        ("XS", "XS"),
        ("S", "S"),
        ("M", "M"),
        ("L", "L"),
        ("XL", "XL"),
        ("2XL", "2XL")
    )

    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    clothingSize = models.CharField(max_length=3, choices=CLOTHING_SIZE_CHOICES)

    def __str__(self):
        return self.user.first_name + " " + self.user.last_name


class RunnerSignup(models.Model):
    user=models.ForeignKey(Profile, on_delete=models.CASCADE)
    signupDate=models.DateTimeField(auto_now_add=True)
    classification=models.IntegerField(null=True,blank=True)
    race=models.ForeignKey(Race, on_delete=models.CASCADE)
    adminComment=models.TextField(null=True,blank=True)

    STATE_CHOICES = (
        ("PENDENTE", "Pendente"),
        ("APROVADO", "Aprovado"),
        ("REJEITADO", "Rejeitado")
    )

    state = models.CharField(max_length=20, choices=STATE_CHOICES)

    def __str__(self):
        return self.user.user.first_name+" "+self.user.user.last_name


class VolunteerSignup(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    signupDate=models.DateTimeField(auto_now_add=True)
    race=models.ForeignKey(Race, on_delete=models.CASCADE)
    adminComment = models.TextField(null=True,blank=True)

    ROLE_CHOICES = (
        ("ENTREGA_DORSAIS", "Entrega de Dorsais"),
        ("APOIO_PARTIDA", "Apoio na Partida"),
        ("COACH_BANCADA", "Coach de Bancada"),
        ("ORIENTACAO", "Orientação"),
        ("ABASTECIMENTOS", "Abastecimentos"),
        ("SEGURANCA", "Segurança"),
        ("PRIMEIROS_SOCORROS", "Primeiros Socorros"),
        ("PACER", "Pacer")
    )

    STATE_CHOICES = (
        ("PENDENTE", "Pendente"),
        ("APROVADO", "Aprovado"),
        ("REJEITADO", "Rejeitado")
    )
    state = models.CharField(max_length=20, choices=STATE_CHOICES)
    role = models.CharField(max_length=30, choices=ROLE_CHOICES)


    def __str__(self):
        return self.user.user.first_name+" "+self.user.user.last_name




