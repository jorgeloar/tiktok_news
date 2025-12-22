import React, { useState } from 'react';
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

  // Muestra el prompt solo visualmente (Make construye el real)
  const constructPrompt = () => {
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

  // --- LÓGICA PARA MAKE / OPENAI ---
  const generateScript = async () => {
    // 1. Validaciones
    if (!formData.url || (!formData.protagonista && formData.relevancia > 0) || !formData.audiencia) {
      setError('Por favor completa la Noticia, la Audiencia y el Protagonista.');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedScript('');

    try {
      // 2. URL DEL WEBHOOK (Directa para probar)
      const webhookUrl = 'https://hook.eu2.make.com/c5s90k7am0gxc1286y64x0sxonidipzx';

      // 3. ENVIAR DATOS A MAKE
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), 
      });

      if (!response.ok) {
        throw new Error('Error al conectar con el servidor de IA');
      }

      // 4. RECIBIR RESPUESTA
      const data = await response.json();
      
      // Verificamos que venga el texto
      if (data.text) {
        setGeneratedScript(data.text);
      } else {
        console.log("Respuesta recibida:", data);
        throw new Error('La respuesta de la IA no tiene el formato esperado (falta campo text).');
      }

    } catch (error) {
      console.error(error);
      setError(error.message || 'Hubo un error generando el guion.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const relevanceDetails = getRelevanceDetails(formData.relevancia);
  const RelevanceIcon = relevanceDetails.icon;

  return (
    <div className="min-h-screen font-sans text-slate-800 relative overflow-hidden selection:bg-[#F9DD0D] selection:text-black" style={{ backgroundColor: '#F8F9FE' }}>
      
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-[#8D36FF] to-[#0758DB] rounded-b-[3rem] shadow-2xl z-0 transform -skew-y-2 origin-top-left scale-110"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FE69B3] opacity-20 blur-3xl rounded-full pointer-events-none z-0 mix-blend-multiply"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-5 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl">
             <div className="h-16 w-16 overflow-hidden rounded-xl shadow-lg border-2 border-[#F9DD0D] bg-black">
                 <img 
                   src="/logo.png" 
                   alt="Logo" 
                   className="h-full w-full object-contain"
                   onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x200/000000/F9DD0D?text=C"; }}
                 />
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-black tracking-tight leading-none drop-shadow-md">
                  ScriptBuilder
                </h1>
                <div className="flex items-center gap-2 mt-1 opacity-90">
                  <span className="text-[10px] font-bold tracking-widest uppercase bg-[#F9DD0D] text-black px-2 py-0.5 rounded shadow-sm">
                    TikTok News
                  </span>
                  <span className="text-xs font-medium text-white/80 tracking-wide">
                    Powered by Conteller & OpenAI
                  </span>
                </div>
              </div>
          </div>
          
          <button 
            onClick={() => setShowPrompt(!showPrompt)}
            className="text-white/80 text-xs font-semibold bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full transition-all backdrop-blur-sm border border-white/10"
          >
            {showPrompt ? 'Ocultar Backend' : 'Modo Desarrollador'}
          </button>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: INPUTS FORM */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-200/50 p-6 md:p-8 border border-white/50 relative overflow-hidden">
                
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#F9DD0D]/20 to-transparent rounded-bl-full -mr-4 -mt-4"></div>

                <h2 className="text-xl font-bold text-[#0758DB] mb-6 flex items-center gap-2">
                    <Zap className="text-[#F9DD0D] fill-current" size={20} />
                    Configuración del Video
                </h2>

                <div className="space-y-6">
                    {/* Input: Noticia */}
                    <div className="group">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-[#8D36FF] transition-colors">
                            <Newspaper size={12} className="inline mr-1 -mt-0.5" /> La Noticia
                        </label>
                        <textarea
                            name="url"
                            value={formData.url}
                            onChange={handleInputChange}
                            placeholder="Pega el link o resumen aquí..."
                            className="w-full p-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#8D36FF] focus:bg-white outline-none transition-all h-24 text-sm font-medium resize-none shadow-inner placeholder:text-slate-300"
                        />
                    </div>

                    {/* Inputs: Medio + Audiencia */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="group">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-[#0758DB] transition-colors">
                                <FileText size={12} className="inline mr-1 -mt-0.5" /> Medio
                            </label>
                            <input
                                type="text"
                                name="medio"
                                value={formData.medio}
                                onChange={handleInputChange}
                                placeholder="Ej. El País..."
                                className="w-full p-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[#0758DB] focus:bg-white outline-none transition-all text-sm font-medium shadow-inner"
                            />
                        </div>
                        <div className="group">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-[#0758DB] transition-colors">
                                <Target size={12} className="inline mr-1 -mt-0.5" /> Audiencia
                            </label>
                            <input
                                type="text"
                                name="audiencia"
                                value={formData.audiencia}
                                onChange={handleInputChange}
                                placeholder="Ej. Jóvenes..."
                                className="w-full p-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[#0758DB] focus:bg-white outline-none transition-all text-sm font-medium shadow-inner"
                            />
                        </div>
                    </div>

                    {/* BLOQUE PROTAGONISTA MEJORADO */}
                    <div className="relative bg-slate-50 rounded-2xl p-5 border border-slate-100 shadow-sm">
                        <div className="group mb-4">
                            <label className="block text-xs font-bold text-[#FE69B3] uppercase tracking-wider mb-2 ml-1">
                                <User size={12} className="inline mr-1 -mt-0.5" /> Protagonista
                            </label>
                            <input
                                type="text"
                                name="protagonista"
                                value={formData.protagonista}
                                onChange={handleInputChange}
                                placeholder="Nombre de actor político o institución"
                                className="w-full p-3 bg-white border border-[#FE69B3]/20 rounded-xl focus:ring-2 focus:ring-[#FE69B3] outline-none transition-all text-sm font-medium shadow-sm"
                            />
                        </div>

                        {/* SLIDER UI CON ETIQUETAS LITERALES */}
                        <div className="px-1 pt-2">
                            <div className="flex justify-between items-center mb-4">
                                <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                    <Sliders size={12} /> Intensidad
                                </label>
                                <span className="text-[10px] font-mono text-slate-300 bg-slate-100 px-1 rounded">
                                    {formData.relevancia}/10
                                </span>
                            </div>
                            
                            {/* Visual Feedback Card */}
                            <div className={`mb-4 p-3 rounded-xl border flex items-center gap-3 transition-all duration-300 ${relevanceDetails.bg} ${relevanceDetails.border}`}>
                                <div className={`p-2 rounded-lg bg-white shadow-sm ${relevanceDetails.color}`}>
                                    <RelevanceIcon size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className={`text-xs font-black uppercase ${relevanceDetails.color}`}>
                                        {relevanceDetails.label}
                                    </div>
                                    <div className="text-[10px] font-medium text-slate-600 leading-tight mt-0.5">
                                        {relevanceDetails.desc}
                                    </div>
                                </div>
                            </div>

                            <input 
                                type="range" 
                                name="relevancia"
                                min="0" 
                                max="10" 
                                step="1"
                                value={formData.relevancia}
                                onChange={handleInputChange}
                                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-200"
                                style={{
                                    backgroundImage: `linear-gradient(to right, ${relevanceDetails.bg.includes('slate') ? '#94a3b8' : ''} ${relevanceDetails.bg.includes('cyan') ? '#0891b2' : ''} ${relevanceDetails.bg.includes('violet') ? '#8b5cf6' : ''} ${relevanceDetails.bg.includes('pink') ? '#f43f5e' : ''} 0%, transparent 100%)`
                                }}
                            />
                             {/* ETIQUETAS DE GUÍA VISUAL */}
                            <div className="flex justify-between text-[8px] font-bold text-slate-400 mt-2 uppercase tracking-wide px-1">
                                <span>Sin Mención</span>
                                <span>Ligera</span>
                                <span>Clara</span>
                                <span>Centro</span>
                            </div>
                        </div>
                    </div>

                    {/* Input: Mensaje Clave */}
                    <div className="group">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-[#0758DB] transition-colors">
                            <MessageSquare size={12} className="inline mr-1 -mt-0.5" /> Mensaje Clave
                        </label>
                        <input
                            type="text"
                            name="mensajeClave"
                            value={formData.mensajeClave}
                            onChange={handleInputChange}
                            placeholder="Ej. Resolver, escuchar..."
                            className="w-full p-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[#0758DB] focus:bg-white outline-none transition-all text-sm font-medium shadow-inner"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-[#DE4A04] text-xs rounded-lg border border-red-100 flex items-center gap-2 font-bold animate-pulse">
                            <AlertTriangle size={14} />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        onClick={generateScript}
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-black text-lg text-white shadow-xl shadow-indigo-500/30 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/50 flex items-center justify-center gap-3 relative overflow-hidden group ${
                            loading ? 'opacity-80 cursor-not-allowed grayscale' : 'bg-gradient-to-r from-[#8D36FF] to-[#0758DB]'
                        }`}
                    >
                        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 group-hover:left-full transition-all duration-700 ease-in-out"></div>
                        {loading ? (
                            <><RefreshCw className="animate-spin" /> Creando...</>
                        ) : (
                            <><Sparkles className="text-[#F9DD0D] fill-current" /> Generar Guion de Video</>
                        )}
                    </button>
                </div>
            </div>

            {/* Prompt Técnico */}
            {showPrompt && (
                <div className="bg-slate-900 rounded-xl p-4 shadow-inner border border-slate-700 mt-4 overflow-hidden animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-mono text-[#F9DD0D]">backend_logic.txt</span>
                        <button onClick={() => handleCopy(constructPrompt())} className="text-slate-400 hover:text-white"><Copy size={12}/></button>
                    </div>
                    <pre className="text-[10px] font-mono text-slate-300 whitespace-pre-wrap max-h-40 overflow-y-auto custom-scrollbar">
                            {constructPrompt()}
                    </pre>
                </div>
            )}
          </div>

          {/* RIGHT: RESULTS */}
          <div className="lg:col-span-7 h-full min-h-[600px] flex flex-col">
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-200/40 border border-white/60 flex-grow flex flex-col relative overflow-hidden">
                
                <div className="p-6 border-b border-slate-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#F9DD0D] p-2 rounded-lg text-black shadow-sm">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 leading-tight">Tu Guion</h3>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Listo para grabar</p>
                        </div>
                    </div>
                    
                    {generatedScript && (
                        <button 
                            onClick={() => handleCopy(generatedScript)}
                            className="group flex items-center gap-2 text-xs font-bold px-4 py-2 bg-slate-100 text-slate-600 rounded-full hover:bg-[#0758DB] hover:text-white transition-all shadow-sm"
                        >
                            {copied ? <CheckCircle size={14} className="text-green-500 group-hover:text-white"/> : <Copy size={14} />}
                            {copied ? '¡Copiado!' : 'Copiar'}
                        </button>
                    )}
                </div>

                <div className="flex-grow p-8 overflow-y-auto custom-scrollbar bg-slate-50/30">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-8 py-20">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-[#8D36FF] animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Video className="text-[#FE69B3] animate-pulse" size={32} />
                                </div>
                            </div>
                            <div className="text-center space-y-2">
                                <p className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-[#8D36FF] to-[#0758DB]">
                                    Analizando estructura viral...
                                </p>
                                <p className="text-xs text-slate-400 font-medium">Conectando con Make.com & OpenAI...</p>
                            </div>
                        </div>
                    ) : generatedScript ? (
                        <div className="prose prose-sm md:prose-base max-w-none prose-headings:text-[#0758DB] prose-a:text-[#FE69B3]">
                            <div className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                {generatedScript}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-20 opacity-50">
                            <div className="bg-slate-100 p-8 rounded-[2rem]">
                                <Video size={48} className="text-[#8D36FF]" />
                            </div>
                            <div className="max-w-xs">
                                <h4 className="font-bold text-slate-700 mb-1">Esperando datos...</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Rellena el formulario a la izquierda para generar magia.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {generatedScript && (
                    <div className="p-3 bg-[#F9DD0D] text-[#DE4A04] text-[10px] font-black uppercase tracking-widest text-center">
                        💡 Tip: Graba con luz natural frente a una ventana
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #ffffff;
            border: 2px solid currentColor;
            box-shadow: 0 2px 5px rgba(0,0,0,0.15);
            margin-top: -6px;
            transition: transform 0.1s;
        }
        input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.1); }
        input[type=range]::-webkit-slider-runnable-track { height: 8px; border-radius: 999px; }
      `}</style>
    </div>
  );
};

export default UgcScriptGenerator;
