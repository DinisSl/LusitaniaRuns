from django.contrib.auth.models import User
from django.utils.dateparse import parse_datetime, parse_date
from race.models import *


def populate():
    print("A apagar dados antigos...")
    User.objects.exclude(is_superuser=True, username="admin").delete()
    Race.objects.all().delete()
    Profile.objects.all().delete()
    RunnerSignup.objects.all().delete()
    VolunteerSignup.objects.all().delete()

    print("A criar Users...")
    users_data = [
        {"username": "dinis", "first_name": "", "last_name": "", "email": "d@gmail.com", "is_superuser": True,
         "is_staff": True, "password": "123", "date_joined": "2026-05-20T15:26:56Z"},
        {"username": "BarackObama", "first_name": "Barack", "last_name": "Obama", "email": "obama@iscte-iul.pt",
         "is_superuser": False, "is_staff": True, "password": "123", "date_joined": "2026-05-20T15:28:46Z"},
        {"username": "XiJinping", "first_name": "Xi", "last_name": "Jinping", "email": "xiji@iscte-iul.pt",
         "is_superuser": False, "is_staff": False, "password": "123", "date_joined": "2026-05-21T19:02:24Z"},
        {"username": "AfonsoMartins", "first_name": "Afonso", "last_name": "Martins", "email": "aa@gmail.com",
         "is_superuser": False, "is_staff": False, "password": "123", "date_joined": "2026-05-22T09:56:33Z"},
        {"username": "BernardoLuziario", "first_name": "Bernardo", "last_name": "Luziario",
         "email": "bernardo.luziario@gmail.com", "is_superuser": False, "is_staff": False, "password": "123",
         "date_joined": "2026-05-22T09:55:39Z"},
        {"username": "MargaridaFreire", "first_name": "Margarida", "last_name": "Freire", "email": "maggy@iscte-iul.pt",
         "is_superuser": False, "is_staff": False, "password": "123", "date_joined": "2026-05-22T18:03:26Z"},
        {"username": "JoãoPedro", "first_name": "João", "last_name": "Pedro", "email": "pedro@iscte-iul.pt",
         "is_superuser": False, "is_staff": False, "password": "123", "date_joined": "2026-05-21T13:53:08Z"},
    ]

    created_users = {}
    for u in users_data:
        user = User(
            username=u["username"],
            first_name=u["first_name"],
            last_name=u["last_name"],
            email=u["email"],
            is_superuser=u["is_superuser"],
            is_staff=u["is_staff"],
            date_joined=parse_datetime(u["date_joined"])
        )
        user.set_password(u["password"])  # Melhor prática para guardar a pass
        user.save()
        created_users[u["username"]] = user

    print("A criar Profiles...")
    profiles_data = [
        {"user": "BarackObama", "image": "profile_pics/250px-Official_portrait_of_Barack_Obama_z7dtRpf.jpg",
         "birthDate": "2026-04-28", "phoneNumber": "938907266", "gender": "M", "clothingSize": "L"},
        {"user": "XiJinping", "image": "profile_pics/Xi_Jinping_in_July_2024_cropped.jpg", "birthDate": "1953-05-15",
         "phoneNumber": "917505842", "gender": "M", "clothingSize": "XL"},
        {"user": "AfonsoMartins", "image": "default.png", "birthDate": "2026-05-16", "phoneNumber": "938907266",
         "gender": "M", "clothingSize": "M"},
        {"user": "BernardoLuziario", "image": "default.png", "birthDate": "2026-04-30", "phoneNumber": "917505842",
         "gender": "M", "clothingSize": "M"},
        {"user": "MargaridaFreire", "image": "default.png", "birthDate": "2026-05-08", "phoneNumber": "938907266",
         "gender": "F", "clothingSize": "S"},
        {"user": "JoãoPedro", "image": "default.png", "birthDate": "2005-07-12", "phoneNumber": "938907266",
         "gender": "M", "clothingSize": "L"},
    ]

    for p in profiles_data:
        Profile.objects.create(
            user=created_users[p["user"]],
            image=p["image"],
            birthDate=parse_date(p["birthDate"]),
            phoneNumber=p["phoneNumber"],
            gender=p["gender"],
            clothingSize=p["clothingSize"]
        )

    print("A criar Races...")
    races_data = [
        {
            "name": "Lidl São Silvestre",
            "date": "2026-12-18T18:00:00Z",
            "image": "race_pics/malta_correr.jpg",
            "details": "A Lidl S. Silvestre Cidade do Porto irá voltar com o objetivo de cumprir a tradição e encher as ruas da Invicta, tentando reunir bastantes participantes naquela que é uma das provas mais emblemáticas do atletismo nacional.\n\nA corrida terá início às 18h00, na Avenida dos Aliados, e termina junto à Câmara Municipal do Porto, num percurso marcado por um ambiente festivo, grande adesão popular e forte apoio do público ao longo de todo o trajeto. O tiro de partida vai ser dado pelo presidente da Câmara Municipal do Porto, Pedro Duarte, acompanhado pelo vereador Rodrigo Passos, Paulo Santos, vice-presidente do IPDJ, João Duarte, diretor-geral do Lidl Portugal, o apresentador Jorge Gabriel e o futebolista internacional português Pepe.\n\nApós o final da prova, irá haver a cerimónia de pódio, junto à meta.\n\nDurante este momento simbólico, será entregue uma lembrança à Câmara Municipal do Porto e ao Lidl, naming sponsor do evento. A entrega é realizada por Jorge Teixeira, Diretor-Geral da Runporto, o apresentador Jorge Gabriel e o internacional português Pepe. A entrega dos prémios aos vencedores conta com a presença de Pedro Duarte, Presidente da Câmara Municipal do Porto, Paulo Santos, vice-presidente do IPDJ e João Duarte, Diretor-Geral do Lidl Portugal."
        },
        {
            "name": "Corrida dos Gambuzinos",
            "date": "2026-06-28T09:45:00Z",
            "image": "race_pics/gambuzinos.jpg",
            "details": "A Corrida dos Gambuzinos irá voltar com o objetivo de cumprir a tradição e encher as ruas de Pombal, tentando reunir bastantes participantes naquela que é uma das provas mais emblemáticas do atletismo regional.\n\nA corrida terá início às 10h00, no Largo do Cardal, e termina junto ao Castelo de Pombal, num percurso marcado por um ambiente festivo, grande adesão popular e forte apoio do público ao longo de todo o trajeto. O tiro de partida vai ser dado pelo presidente da Câmara Municipal de Pombal, Pedro Pimpão, acompanhado pelo vereador do Desporto, Catarina Silva, pelo presidente da Junta de Freguesia de Pombal, Nuno Gonçalves, pelo representante do patrocinador principal e por antigos atletas de renome da região.\n\nApós o final da prova, irá haver a cerimónia de pódio, junto à meta.\n\nDurante este momento simbólico, será entregue uma lembrança à Câmara Municipal de Pombal e ao naming sponsor do evento. A entrega é realizada pelo presidente da organização, por figuras convidadas e por antigos atletas de renome da região. A entrega dos prémios aos vencedores conta com a presença de Pedro Pimpão, Presidente da Câmara Municipal de Pombal, do vereador do Desporto, e de representantes das entidades parceiras."
        },
        {
            "name": "Corrida de Belém",
            "date": "2027-05-10T09:00:00Z",
            "image": "race_pics/corrida_1.jpg",
            "details": "A Corrida de Belém irá voltar com o objetivo de cumprir a tradição e encher as ruas da capital, tentando reunir bastantes participantes naquela que é uma das provas mais emblemáticas do atletismo nacional.\n\nA corrida terá início às 10h00, junto ao Mosteiro dos Jerónimos, e termina na Praça do Império, num percurso marcado por um ambiente festivo, grande adesão popular e forte apoio do público ao longo de todo o trajeto.\n\nO tiro de partida vai ser dado pelo presidente da Câmara Municipal de Lisboa, Carlos Moedas, acompanhado pelo vereador Ângelo Pereira, pelo presidente da Junta de Freguesia de Belém, pelo diretor-geral do parceiro principal do evento e por figuras convidadas do desporto nacional.\n\nApós o final da prova, irá haver a cerimónia de pódio, junto à meta. Durante este momento simbólico, será entregue uma lembrança à Câmara Municipal de Lisboa e ao naming sponsor do evento. A entrega é realizada pelo diretor-geral da organização, por figuras convidadas e por um atleta internacional português. A entrega dos prémios aos vencedores conta com a presença de Carlos Moedas, Presidente da Câmara Municipal de Lisboa, do presidente da Junta de Freguesia de Belém e do diretor-geral do parceiro principal da prova."
        }
    ]

    race_objs = {}
    for r in races_data:
        race = Race.objects.create(
            name=r["name"],
            date=parse_datetime(r["date"]),
            image=r["image"],
            details=r["details"]
        )
        race_objs[r["name"]] = race

    print("A criar Inscrições Pendentes...")
    # Exemplos de inscrições pendentes para os utilizadores que aparecem na DB
    if "JoãoPedro" in created_users:
        VolunteerSignup.objects.create(
            user=created_users["JoãoPedro"].profile,
            race=race_objs["Corrida dos Gambuzinos"],
            role="APOIO_PARTIDA",
            state="PENDENTE"
        )

    if "AfonsoMartins" in created_users:
        RunnerSignup.objects.create(
            user=created_users["AfonsoMartins"].profile,
            race=race_objs["Lidl São Silvestre"],
            state="PENDENTE"
        )

    print("Base de dados populada com sucesso!")


populate()