import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function NetworkBackground() {
    const particlesInit = useCallback(async (engine) => {
        await loadFull(engine);
    }, []);

    return (
        <Particles
            init={particlesInit}
            options={{
                fullScreen: { enable: false },
                background: { color: "transparent" },
                fpsLimit: 60,
                particles: {
                    number: { value: 100 },
                    color: { value: "#05acc1" },
                    links: {
                        enable: true,
                        color: "#05acc1",
                        distance: 160,
                        opacity: 0.5,
                        width: 1.5
                    },
                    move: {
                        enable: true,
                        speed: 1.8,
                    },
                    opacity: { value: 1.0 },
                    size: { value: 5 }
                },
                interactivity: {
                    events: {
                        onHover: { enable: true, mode: "grab" }
                    },
                    modes: {
                        grab: {
                            distance: 250,
                            links: { opacity: 0.8 }
                        }
                    }
                }
            }}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 0
            }}
        />
    );
}