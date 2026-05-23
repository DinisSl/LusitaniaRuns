import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";

const Footer = () => {
    return (
        <footer className="bg-secondary text-muted-foreground px-5 pt-10 pb-2.5 font-sans">
            <div className="flex gap-7.5 w-full">

                <div className="flex-1">
                    <h4 className="mb-4 text-foreground font-semibold text-lg">Corridas de Portugal</h4>
                    <p className="mb-2">Um site onde se pode ver todas as corridas e onde toda a gente se diverte.</p>
                    <strong className="text-foreground block mt-8">Venha correr connosco!</strong>
                </div>

                <div className="flex-1">
                    <h4 className="mb-4 text-foreground font-semibold text-lg">Organizadores</h4>
                    <p className="mb-2">Afonso Martins</p>
                    <p className="mb-2">Bernardo Luziário</p>
                    <p className="mb-2">Carlos Reis</p>
                    <p className="mb-2">Dinis Lopes</p>
                </div>

                <div className="flex-1">
                    <h4 className="mb-4 text-foreground font-semibold text-lg">Patrocinadores</h4>
                    <ul className="list-none p-0">
                        <li className="mb-2"><a href="https://www.lidl.pt/" className="hover:text-foreground transition-colors no-underline">Lidl</a></li>
                        <li className="mb-2"><a href="https://tvi.iol.pt/" className="hover:text-foreground transition-colors no-underline">TVI</a></li>
                        <li className="mb-2"><a href="https://www.edp.pt/" className="hover:text-foreground transition-colors no-underline">edp</a></li>
                        <li className="mb-2"><a href="https://mimosa.pt/" className="hover:text-foreground transition-colors no-underline">Mimosa</a></li>
                    </ul>
                </div>

                <div className="flex-1">
                    <h4 className="mb-4 text-foreground font-semibold text-lg">Redes Sociais</h4>
                    <ul className="list-none p-0">
                        <li className="mb-2"><a href="https://web.facebook.com/saosilvestredelisboa" className="hover:text-foreground transition-colors no-underline">Facebook</a></li>
                        <li className="mb-2"><a href="https://www.instagram.com/saosilvestredelisboa" className="hover:text-foreground transition-colors no-underline">Instagram</a></li>
                        <li className="mb-2"><a href="https://www.youtube.com/playlist?list=PL1zIRddiEL3TuNTlZiNSkEFiJO8fiyWRA" className="hover:text-foreground transition-colors no-underline">YouTube</a></li>
                    </ul>
                </div>

                <div className="flex-1">
                    <h4 className="mb-4 text-foreground font-semibold text-lg">Newsletter</h4>
                    <form className="flex flex-col gap-2 m-0" onSubmit={(e) => e.preventDefault()}>
                        <Input
                            type="email"
                            placeholder="O teu email"
                            className="w-full bg-background"
                        />
                        <Button type="submit" variant="default" className="w-full">
                            Enviar
                        </Button>
                    </form>
                    <div className="mt-4">
                        <strong className="text-foreground">Contacto: <br /> +351 951 345 678</strong>
                    </div>
                </div>

            </div>

            <div className="text-center border-t border-border mt-10 pt-4 text-sm">
                <p>© 2026 Corrida de S. Silvestre Porto</p>
            </div>

        </footer>
    );
};

export default Footer;