import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const raceSchema = z.object({
  name: z.string().min(1, "O nome da corrida é obrigatório"),
  date: z.date({ required_error: "A data e hora são obrigatórias" }),
  details: z.string().optional(),
  image: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, "A imagem é obrigatória")
    .transform((files) => files[0]),
});

const CreateRace = () => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const obterTokenCSRF = () => {
    const cookieCSRF = document.cookie
      .split("; ")
      .find((linha) => linha.startsWith("csrftoken="));
    return cookieCSRF ? cookieCSRF.split("=")[1] : null;
  };
// Zod define as regras no raceSchema; react-hook-form integra via zodResolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(raceSchema),
    defaultValues: {
      name: "",
      date: undefined,
      details: "",
    },
  });

  const selectedDate = watch("date");

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setValue("image", e.target.files, { shouldValidate: true });
    } else {
      setPreviewUrl(null);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", data.name);
    // Enviar a data no formato ISO (com timezone local)
    formData.append("date", data.date.toISOString());
    formData.append("details", data.details || "");
    formData.append("image", data.image);

    try {
      await axios.post("http://localhost:8000/race/api/races/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": obterTokenCSRF()
        },
        withCredentials: true,
      });
      alert("Corrida criada com sucesso!");
      reset();
      setPreviewUrl(null);
      setValue("date", undefined);
    } catch (error) {
      console.error("Erro ao criar corrida:", error);
      alert("Erro ao criar corrida. Verifique a consola.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-background shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Criar Nova Corrida</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">
            Nome da Corrida *
          </label>
          <Input placeholder="Ex: Corrida da Ponte" {...register("name")} />
          {errors.name && (
            <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Data e Hora  */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-foreground">
            Data e Hora *
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP 'às' HH:mm", { locale: pt })
                ) : (
                  <span>Selecionar data e hora</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    // Manter a hora atual se já existir, ou definir 12:00
                    const currentDate = selectedDate || new Date();
                    date.setHours(currentDate.getHours(), currentDate.getMinutes());
                    setValue("date", date);
                  }
                }}
                initialFocus
              />
              {/* Seletor de horas manual  */}
              {selectedDate && (
                <div className="border-t p-3 flex gap-2">
                  <Input
                    type="time"
                    value={format(selectedDate, "HH:mm")}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(":");
                      const newDate = new Date(selectedDate);
                      newDate.setHours(parseInt(hours), parseInt(minutes));
                      setValue("date", newDate);
                    }}
                    className="w-full"
                  />
                </div>
              )}
            </PopoverContent>
          </Popover>
          {errors.date && (
            <p className="text-destructive text-sm mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Detalhes */}
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">
            Detalhes
          </label>
          <Textarea
            placeholder="Descreva o percurso, dificuldade, prémios..."
            rows={4}
            {...register("details")}
          />
          {errors.details && (
            <p className="text-destructive text-sm mt-1">{errors.details.message}</p>
          )}
        </div>

        {/* Imagem */}
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">
            Imagem da Corrida *
          </label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="cursor-pointer"
          />
          {errors.image && (
            <p className="text-destructive text-sm mt-1">{errors.image.message}</p>
          )}
          {previewUrl && (
            <div className="mt-3">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-32 w-auto object-cover rounded border border-border"
              />
              <p className="text-xs text-muted-foreground mt-1">Pré-visualização</p>
            </div>
          )}
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "A criar..." : "Criar Corrida"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateRace;