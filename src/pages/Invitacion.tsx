import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { evento } from "../data/evento";
import { buscarInvitado } from "../lib/invitados";
import { media } from "../lib/media";
import IntroOverlay from "../components/invitacion/IntroOverlay";
import Hero from "../components/invitacion/Hero";
import PaseInvitado from "../components/invitacion/PaseInvitado";
import Historia from "../components/invitacion/Historia";
import Programa from "../components/invitacion/Programa";
import Regalos from "../components/invitacion/Regalos";
import Detalles from "../components/invitacion/Detalles";
import Rsvp from "../components/invitacion/Rsvp";
import CelebracionOverlay from "../components/invitacion/CelebracionOverlay";
import Divisor from "../components/invitacion/Divisor";
import Viaje from "../components/invitacion/Viaje";
import Footer from "../components/invitacion/Footer";
import BotonMusica from "../components/invitacion/BotonMusica";

export default function Invitacion() {
  const { id } = useParams();
  const invitado = buscarInvitado(id);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [mostrarIntro, setMostrarIntro] = useState(true);
  // El video de la portada espera a que el intro termine de descargarse, para no competir por la red
  const [cargarHero, setCargarHero] = useState(false);
  const [silenciado, setSilenciado] = useState(true);
  const [hayMusica, setHayMusica] = useState(true);
  const [celebrando, setCelebrando] = useState(false);

  useEffect(() => {
    const novios = `${evento.novios.novia} & ${evento.novios.novio}`;
    document.title = invitado ? `${invitado.nombre} · Boda de ${novios}` : `${novios} · Nuestra Boda`;
  }, [invitado]);

  const reproducirMusica = () => {
    const audio = audioRef.current;
    if (!audio || !hayMusica) return;
    audio.muted = false;
    audio.play().then(
      () => setSilenciado(false),
      () => setSilenciado(true),
    );
  };

  const alternarMusica = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (silenciado) {
      reproducirMusica();
    } else {
      audio.pause();
      setSilenciado(true);
    }
  };

  return (
    <div className="min-h-screen">
      <audio ref={audioRef} src={media.musica} loop preload="none" onError={() => setHayMusica(false)} />

      {mostrarIntro && (
        <IntroOverlay
          onAbrir={reproducirMusica}
          onDescargado={() => setCargarHero(true)}
          onTerminar={() => {
            setCargarHero(true);
            setMostrarIntro(false);
          }}
        />
      )}
      {celebrando && <CelebracionOverlay onTerminar={() => setCelebrando(false)} />}

      <Hero cargarVideo={cargarHero} />
      {invitado && <PaseInvitado invitado={invitado} />}
      <Historia />
      <Programa />
      <Regalos />
      <Detalles />
      <Rsvp key={invitado?.id ?? "generico"} invitado={invitado} celebrando={celebrando} onCelebrar={() => setCelebrando(true)} />
      <Divisor />
      <Viaje />
      <Footer />

      {hayMusica && !mostrarIntro && <BotonMusica silenciado={silenciado} onAlternar={alternarMusica} />}
    </div>
  );
}
