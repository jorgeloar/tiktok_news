import React, { useState } from 'react';
// CORRECCIÓN: Imports correctos
import { Copy, RefreshCw, FileText, CheckCircle, Video, User, MessageSquare, Target, Newspaper, AlertTriangle, Sparkles, Sliders, Zap, Ghost, Eye, Users, Star } from 'lucide-react';

const UgcScriptGenerator = () => {
  const [formData, setFormData] = useState({
    url: '',
    medio: '',
    protagonista: '',
    audiencia: '',
    mensajeClave: '',
    relevancia: 3
  });

  const [loading, setLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [error, setError] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // UX VISUAL DEL SLIDER
  const getRelevanceDetails = (val) => {
    const v = parseInt(val);
    if (v === 0) return {
        label: "Sin mención",
        icon: Ghost,
        desc: "El personaje no aparecerá en el guion. Foco 100% en la noticia.",
        color: "text-slate-400",
        bg: "bg-slate-50",
        border: "border-slate-200",
        gradient: "from-slate-200 to-slate-300"
    };
    if (v <= 3) return {
        label: "Mención ligera",
        icon: Eye,
        desc: "Apenas se menciona una vez como contexto (Product Placement).",
        color: "text-cyan-600",
        bg: "bg-cyan-50",
        border: "border-cyan-200",
        gradient: "from-cyan-400 to-blue-500"
    };
    if (v <= 7) return {
        label: "Relevancia clara",
        icon: Users,
        desc: "Aparece activamente conectando el problema con la solución.",
        color: "text-[#8D36FF]",
        bg: "bg-violet-50",
        border: "border-violet-200",
        gradient: "from-[#8D36FF] to-indigo-600"
    };
    return {
        label: "Centro del mensaje",
        icon: Star,
        desc: "Es el foco principal. Todo el video gira en torno a su acción.",
        color: "text-[#FE69B3]",
        bg: "bg-pink-50",
        border: "border-pink-200",
        gradient: "from-[#FE69B3] to-rose-500"
    };
  };

  // Esta función es solo para mostrar el prompt en pantalla ("Modo Desarrollador")
  // NO se envía a Make, ya que Make construye su propio prompt.
  const constructPrompt = () => {
    const relevanceLevel = parseInt(formData.relevancia);
    return `
INPUTS:
[NOTICIA]: ${formData.url}
[MEDIO]: ${formData.medio || 'El medio indicado'}
[PROTAGONISTA]: ${formData.protagonista}
[AUDIENCIA]: ${formData.audiencia}
[MENSAJE]: ${formData.mensajeClave}
(El resto del prompt lo gestiona Make.com)
    `;
  };

  //

