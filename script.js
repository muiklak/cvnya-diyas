/* ==========================================================================
   ⚡ CV & LAMPIRAN SURAT HEAD OF NOC (PT VTNET) - SCRIPT ENGINE
   Features: Auto-Print, Dual View Tabs (Lampiran + CV), Dynamic Spotlight,
             3D Tilt Physics, Interactive Particle Mesh, Number Counters,
             Liquid Progress Fill, One-Click Email Copy & Toast Notification.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------------------------
    // 1. TANGGAL OTOMATIS SURAT FORMAT INDONESIA
    // -------------------------------------------------------------------------
    const letterDateEl = document.getElementById('letterDate');
    const today = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('id-ID', options);
    if (letterDateEl) {
        letterDateEl.textContent = `Batujaya, ${formattedDate}`;
    }

    // -------------------------------------------------------------------------
    // 2. AUTO PRINT (Otomatis Membuka Dialog Cetak / Simpan PDF)
    // -------------------------------------------------------------------------
    // Memberikan jeda 1.2 detik agar semua font, ikon, dan styling dirender sempurna
    window.addEventListener('load', () => {
        setTimeout(() => {
            window.print();
        }, 1200);
    });

    // -------------------------------------------------------------------------
    // 2B. CETAK KHUSUS DOKUMEN LAMPIRAN (Surat Lamaran Full A4)
    // -------------------------------------------------------------------------
    window.printLampiranDocument = function() {
        const imgUrl = 'lampiran/surat-lamaran.jpg';
        const pdfUrl = 'lampiran/surat-lamaran.pdf';

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            window.open(pdfUrl, '_blank');
            return;
        }

        printWindow.document.write(`<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Surat Lamaran - Diyas Nugraha</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 0;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        html, body {
            width: 100%;
            height: 100%;
            background: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
    </style>
</head>
<body>
    <img src="${imgUrl}" alt="Surat Lamaran Diyas Nugraha" onload="setTimeout(function(){ window.print(); }, 300);" />
</body>
</html>`);
        printWindow.document.close();
    };

    // -------------------------------------------------------------------------
    // 3. TAB SWITCHER (Lampiran Surat PT VTNET <-> Curriculum Vitae)
    // -------------------------------------------------------------------------
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');

            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const target = document.getElementById(targetId);
            if (target) {
                target.classList.add('active');
            }

            // Scroll to top smoothly on tab switch
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // -------------------------------------------------------------------------
    // 4. TOAST NOTIFICATION
    // -------------------------------------------------------------------------
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    let toastTimer = null;

    function showToast(message) {
        if (!toast) return;
        if (toastTimer) clearTimeout(toastTimer);
        toastMsg.textContent = message;
        toast.classList.add('show');
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 2800);
    }

    // -------------------------------------------------------------------------
    // 5. CURSOR GLOW SPOTLIGHT TRACKER
    // -------------------------------------------------------------------------
    const cursorGlow = document.getElementById('cursorGlow');
    let mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let currentGlow = { x: mousePos.x, y: mousePos.y };

    window.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    });

    function updateCursorGlow() {
        if (cursorGlow) {
            currentGlow.x += (mousePos.x - currentGlow.x) * 0.12;
            currentGlow.y += (mousePos.y - currentGlow.y) * 0.12;
            cursorGlow.style.left = `${currentGlow.x}px`;
            cursorGlow.style.top = `${currentGlow.y}px`;
        }
        requestAnimationFrame(updateCursorGlow);
    }
    updateCursorGlow();

    // -------------------------------------------------------------------------
    // 6. CARD SPOTLIGHT EFFECT (Coordinates per card)
    // -------------------------------------------------------------------------
    const spotlightCards = document.querySelectorAll('.spotlight-card');
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // -------------------------------------------------------------------------
    // 7. 3D TILT PHYSICS
    // -------------------------------------------------------------------------
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -4.5;
            const rotateY = ((x - centerX) / centerX) * 4.5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });

    // -------------------------------------------------------------------------
    // 8. ANIMATED NUMBER COUNTERS
    // -------------------------------------------------------------------------
    const counters = document.querySelectorAll('.counter');
    function startCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 1200;
            const steps = 30;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, duration / steps);
        });
    }
    setTimeout(startCounters, 300);

    // -------------------------------------------------------------------------
    // 9. ANIMATED LIQUID SKILL PROGRESS FILL
    // -------------------------------------------------------------------------
    const skillBars = document.querySelectorAll('.animated-bar');
    setTimeout(() => {
        skillBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
        });
    }, 450);

    // -------------------------------------------------------------------------
    // 10. ONE-CLICK EMAIL COPY
    // -------------------------------------------------------------------------
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = 'diyasnugrahs@gmail.com';
            if (navigator.clipboard) {
                navigator.clipboard.writeText(email).then(() => {
                    showToast('Email diyasnugrahs@gmail.com berhasil disalin! 📋');
                }).catch(() => {
                    showToast('Email: diyasnugrahs@gmail.com');
                });
            } else {
                showToast('Email: diyasnugrahs@gmail.com');
            }
        });
    }

    // -------------------------------------------------------------------------
    // 11. SHARE BUTTON
    // -------------------------------------------------------------------------
    const btnShare = document.getElementById('btnShare');
    if (btnShare) {
        btnShare.addEventListener('click', () => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    showToast('Tautan dokumen berhasil disalin ke clipboard!');
                });
            } else {
                showToast('Tautan siap dibagikan!');
            }
        });
    }

    // -------------------------------------------------------------------------
    // 12. THEME TOGGLE (Dark / Light Mode)
    // -------------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('theme-light');
            const isLight = document.body.classList.contains('theme-light');
            themeToggleBtn.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
            showToast(isLight ? 'Mode Terang Diaktifkan' : 'Mode Gelap Diaktifkan');
        });
    }

    // -------------------------------------------------------------------------
    // 13. INTERACTIVE AMBIENT CONSTELLATION CANVAS
    // -------------------------------------------------------------------------
    const canvas = document.getElementById('ambientCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const count = 40;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.radius = Math.random() * 2 + 1;
                const colors = ['#6366f1', '#38bdf8', '#fbbf24', '#10b981'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                const dx = mousePos.x - this.x;
                const dy = mousePos.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const angle = Math.atan2(dy, dx);
                    this.x -= Math.cos(angle) * 0.5;
                    this.y -= Math.sin(angle) * 0.5;
                }

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color;
                ctx.fill();
            }
        }

        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 115) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.16 * (1 - dist / 115)})`;
                        ctx.lineWidth = 0.9;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animate);
        }
        animate();
    }
});
