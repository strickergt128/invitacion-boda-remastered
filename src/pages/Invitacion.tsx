import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { evento } from "../data/evento";
import { buscarInvitado } from "../lib/invitados";
import { media, videosDecorativos } from "../lib/media";
import { desbloquearVideos } from "../lib/video";
import IntroOverlay from "../components/invitacion/IntroOverlay";
import Hero from "../components/invitacion/Hero";
import PaseInvitado from "../components/invitacion/PaseInvitado";
import Padres from "../components/invitacion/Padres";
import CuentaRegresiva from "../components/invitacion/CuentaRegresiva";
import Historia from "../components/invitacion/Historia";
import Galeria from "../components/invitacion/Galeria";
import Lugares from "../components/invitacion/Lugares";
import Programa from "../components/invitacion/Programa";
import Vestimenta from "../components/invitacion/Vestimenta";
import Regalos from "../components/invitacion/Regalos";
import Rsvp from "../components/invitacion/Rsvp";
import CelebracionOverlay from "../components/invitacion/CelebracionOverlay";
import Footer from "../components/invitacion/Footer";
import BotonMusica from "../components/invitacion/BotonMusica";

export default function Invitacion() {
  const { id } = useParams();
  const invitado = buscarInvitado(id);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [mostrarIntro, setMostrarIntro] = useState(true);
  // La portada entra mientras el sobre se desvanece
  const [portadaLista, setPortadaLista] = useState(false);
  // El video de la portada espera a que el intro termine de descargarse, para no competir por la red
  const [cargarHero, setCargarHero] = useState(false);
  const [silenciado, setSilenciado] = useState(true);
  const [hayMusica, setHayMusica] = useState(true);
  const [celebrando, setCelebrando] = useState(false);

  // iPhone en bajo consumo solo reproduce videos que se "desbloquearon" durante un toque.
  // Cada toque (empezando por el del sobre) desbloquea los videos decorativos que falten,
  // aunque todavía no estén en pantalla; así luego corren solos al hacer scroll.
  useEffect(() => {
    const desbloquear = () => desbloquearVideos(videosDecorativos);
    document.addEventListener("click", desbloquear, true);
    document.addEventListener("touchend", desbloquear, true);
    return () => {
      document.removeEventListener("click", desbloquear, true);
      document.removeEventListener("touchend", desbloquear, true);
    };
  }, []);

  useEffect(() => {
    const novios = `${evento.novios.novia} & ${evento.novios.novio}`;
    document.title = invitado ? `${invitado.nombre} · Boda de ${novios}` : `${novios} · Nuestra boda`;
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
    <main className="min-h-screen">
      <audio ref={audioRef} src={media.musica} loop preload="none" onError={() => setHayMusica(false)} />

      {mostrarIntro && (
        <IntroOverlay
          onAbrir={reproducirMusica}
          onDescargado={() => setCargarHero(true)}
          onSalir={() => setPortadaLista(true)}
          onTerminar={() => {
            setCargarHero(true);
            setPortadaLista(true);
            setMostrarIntro(false);
          }}
        />
      )}
      {celebrando && <CelebracionOverlay onTerminar={() => setCelebrando(false)} />}

      <Hero cargarVideo={cargarHero} listo={portadaLista} />
      {invitado && <PaseInvitado invitado={invitado} />}
      <Padres />
      <CuentaRegresiva />
      <Historia />
      <Galeria />
      <Lugares />
      <Programa />
      <Vestimenta />
      <Regalos />
      <Rsvp key={invitado?.id ?? "generico"} invitado={invitado} celebrando={celebrando} onCelebrar={() => setCelebrando(true)} />
      <Footer />

      {hayMusica && !mostrarIntro && <BotonMusica silenciado={silenciado} onAlternar={alternarMusica} />}
    </main>
  );
}
