import React, { useRef, useEffect } from "react";

const ParticleNetwork = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const canvasCtx = canvas.getContext("2d");
        let animationFrameId;
        let particles = [];

        // Configuration
        // Limit to max 100 particles, scaling by screen width for performance
        const particleCount = Math.min(Math.floor(window.innerWidth / 15), 100);
        const connectDistance = 150;
        const mouseConnectDistance = 220;
        const themeColor = "5, 172, 193"; // #05acc1
        const themeColorLight = "107, 219, 209"; // #6bdbd1

        let mouse = { x: null, y: null };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        const handleMouseMove = (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseout", handleMouseLeave);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 2 + 1;
                this.baseAlpha = Math.random() * 0.6 + 0.4;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Smooth boundary collisions
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                canvasCtx.beginPath();
                canvasCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                canvasCtx.fillStyle = `rgba(${themeColor}, ${this.baseAlpha})`;
                canvasCtx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        initParticles();

        const animate = () => {
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Connect near particles
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectDistance) {
                        const opacity = 0.5 * (1 - dist / connectDistance);
                        canvasCtx.beginPath();
                        canvasCtx.strokeStyle = `rgba(${themeColor}, ${opacity})`;
                        canvasCtx.lineWidth = 1;
                        canvasCtx.moveTo(particles[i].x, particles[i].y);
                        canvasCtx.lineTo(particles[j].x, particles[j].y);
                        canvasCtx.stroke();
                    }
                }

                // Connect and highlight with mouse interaction
                if (mouse.x && mouse.y) {
                    const dx = particles[i].x - mouse.x;
                    const dy = particles[i].y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouseConnectDistance) {
                        const opacity = 0.6 * (1 - dist / mouseConnectDistance);
                        canvasCtx.beginPath();
                        canvasCtx.strokeStyle = `rgba(${themeColorLight}, ${opacity})`;
                        canvasCtx.lineWidth = 1.5;
                        canvasCtx.moveTo(particles[i].x, particles[i].y);
                        canvasCtx.lineTo(mouse.x, mouse.y);
                        canvasCtx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseout", handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0"
        />
    );
};

export default ParticleNetwork;
