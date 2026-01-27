/* ===================================
   PORTFOLIO CONFIGURATION FILE
   Edit this file to customize your portfolio
   =================================== */

const PORTFOLIO_CONFIG = {
    // Personal Information
    personal: {
        name: "Deven Hodder",
        nickname: "Mr. White",
        title: "Freelancer & Developer",
        tagline: "Full-stack developer, 3D artist, and UI/UX designer",
        description: "I specialize in full-stack development, 3D modeling, animation, and UI/UX design. With expertise in 10+ programming languages and a passion for creating immersive digital experiences.",
        location: "Available for remote work worldwide",
        currentFocus: "Currently expanding my knowledge in SQL and database management while continuing to master existing skills in game development, web applications, and multimedia design."
    },

    // Contact Information
    contact: {
        email: "drhodder1@gmail.com",
        phone: "+1 (602) 615-7923",
        phoneLink: "tel:+16026157923",
        
        // Social Media - Update these with your actual profiles
        social: {
            github: "https://github.com/yourusername",
            linkedin: "https://linkedin.com/in/yourusername",
            twitter: "https://twitter.com/yourusername",
            instagram: "https://instagram.com/yourusername",
            tiktok: "https://tiktok.com/@yourusername"
        },
        
        // Resume
        resumeUrl: "resume.pdf"
    },

    // SEO & Meta Information
    seo: {
        siteUrl: "https://devenhodder.com",
        siteName: "Deven Hodder Portfolio",
        description: "Full-stack developer, 3D artist, and UI/UX designer specializing in game development, web applications, and immersive digital experiences. Expert in 10+ programming languages.",
        keywords: [
            "Full-stack developer",
            "3D artist",
            "UI/UX designer",
            "game development",
            "web development",
            "Blender",
            "JavaScript",
            "Python",
            "freelance developer"
        ],
        author: "Deven Hodder",
        ogImage: "https://devenhodder.com/og-image.jpg",
        twitterImage: "https://devenhodder.com/twitter-image.jpg",
        twitterHandle: "@yourusername"
    },

    // Skills & Expertise
    skills: {
        soft: [
            "Fast Learner",
            "Communicative",
            "Reliable",
            "Time Management",
            "Problem Solving",
            "Attention to Detail",
            "Adaptable",
            "Client-Focused",
            "Organized",
            "Self-Motivated"
        ],
        
        professions: [
            "Coder & Scripter",
            "3D Modeler & Animator",
            "UI/UX Designer",
            "VFX & SFX Designer",
            "Game Developer"
        ],
        
        offerings: [
            "Clear and friendly communication",
            "Fast learning and adaptability",
            "Strong attention to detail",
            "Willingness to revise and improve",
            "Commitment to client satisfaction"
        ],
        
        tools: [
            "VS Code, PyCharm, Roblox Studio",
            "Blender, Audacity",
            "Git, GitHub, Discord.js",
            "Figma, Canva, Trello"
        ],
        
        learning: [
            "Game development workflows",
            "Improving UI/UX design skills",
            "3D modeling and animation",
            "Clean and efficient coding",
            "Client communication best practices"
        ]
    },

    // Theme Customization
    theme: {
        colors: {
            // Main Colors
            primary: "#0a0a0a",
            secondary: "#1a1a1a",
            accent: "#dbafff",
            accentDark: "#b88ee6",
            accentLight: "#f0dcff",
            
            // Text Colors
            textPrimary: "#f0f0f0",
            textSecondary: "#aaaaaa",
            textMuted: "#6b6b6b",
            
            // UI Colors
            cardBackground: "#151515",
            borderColor: "rgba(219, 175, 255, 0.15)",
            
            // Status Colors
            success: "#4ade80",
            error: "#f87171",
            warning: "#fbbf24"
        },
        
        fonts: {
            display: "'Manrope', sans-serif",
            mono: "'Space Mono', monospace"
        },
        
        // Animation speeds (in ms)
        animations: {
            fast: 150,
            normal: 300,
            slow: 500
        }
    },

    // Feature Toggles
    features: {
        // Enable/disable features
        enableAnimations: true,
        enableWireframes: true,
        enableParticles: false, // For future enhancement
        enableDarkModeToggle: false, // For future enhancement
        enableBlog: false, // For future enhancement
        
        // Analytics
        googleAnalyticsId: "", // Add your GA4 ID: G-XXXXXXXXXX
        
        // Contact Form
        contactForm: {
            enabled: true,
            endpoint: "/api/contact", // Update with your backend endpoint
            maxMessageLength: 2000,
            enableRecaptcha: false, // Set to true and add key
            recaptchaKey: ""
        }
    },

    // Projects Configuration
    projects: {
        // How many projects to show initially
        initialDisplay: 6,
        
        // Categories for filtering
        categories: [
            "All Work",
            "Featured",
            "Animations",
            "VFX",
            "UI/UX",
            "3D Models",
            "Web Apps",
            "Games"
        ],
        
        // Default placeholder for projects without images
        defaultPlaceholder: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23151515' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23dbafff' font-size='48'%3E?%3C/text%3E%3C/svg%3E"
    },

    // Performance Settings
    performance: {
        // Lazy load images/videos when they're within X pixels of viewport
        lazyLoadOffset: 50,
        
        // Debounce/throttle timings
        scrollThrottle: 100,
        resizeDebounce: 250,
        
        // Maximum pixel ratio for renders
        maxPixelRatio: 2,
        
        // Enable/disable animations on mobile
        animationsOnMobile: true,
        
        // Reduce motion for users who prefer it
        respectReducedMotion: true
    },

    // Legal Pages (create these files if needed)
    legal: {
        privacyPolicyUrl: "#privacy",
        termsOfServiceUrl: "#terms"
    }
};

// Freeze config to prevent accidental modifications
Object.freeze(PORTFOLIO_CONFIG);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PORTFOLIO_CONFIG;
}
