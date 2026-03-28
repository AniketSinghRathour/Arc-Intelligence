'use client';

import { useEffect, useState } from 'react';
import { Entity } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  entities: Entity[];
  mermaidDiagram: string;
}

const TYPE_COLORS: Record<string, string> = {
  person: '#4d9fff',
  company: '#00ff88',
  regulator: '#ff4d4d',
  institution: '#ffb347',
};

type Edge = { source: string; target: string; label: string; isActive: boolean; isDimmed: boolean; labelX?: number; labelY?: number };

export default function EntityWeb({ entities, mermaidDiagram }: Props) {
  // Common State
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Mermaid State
  const [svgStr, setSvgStr] = useState<string | null>(null);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function renderMermaid() {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: '#18181c',
            primaryTextColor: '#e8e8f0',
            primaryBorderColor: '#2a2a30',
            lineColor: '#6b6b7a',
            secondaryColor: '#111113',
            tertiaryColor: '#0a0a0b',
            background: '#0a0a0b',
            mainBkg: '#18181c',
            nodeBorder: '#2a2a30',
            clusterBkg: '#111113',
            titleColor: '#e8e8f0',
            edgeLabelBackground: '#18181c',
            fontFamily: 'JetBrains Mono',
          },
          flowchart: { htmlLabels: true, curve: 'basis' },
        });

        if (cancelled) return;

        let diagram = mermaidDiagram
          .replace(/\\n/g, '\n')
          .replace(/\\t/g, '  ')
          .trim();
          
        diagram = diagram.replace(/^```mermaid\s*/i, '').replace(/\s*```$/i, '').trim();

        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(id, diagram);

        const cleanedSvg = svg
          .replace(/max-width:\s*\d+(\.\d+)?px;?/, '')
          .replace(/width:\s*100%;?/, '');

        if (!cancelled) {
          setSvgStr(cleanedSvg);
          setRenderError(false);
        }
      } catch (err) {
        console.error('Mermaid render error:', err);
        if (!cancelled) setRenderError(true);
      }
    }

    renderMermaid();
    return () => { cancelled = true; };
  }, [mermaidDiagram]);

  // Network Map Prep
  const nodeSet = new Set<string>();
  entities.forEach((e) => {
    nodeSet.add(e.name);
    e.connections?.forEach((c) => nodeSet.add(c.target));
  });
  const allNodes = Array.from(nodeSet);

  const radius = 380;
  const centerX = 500;
  const centerY = 500;

  const nodePositions: Record<string, { x: number; y: number }> = {};
  allNodes.forEach((node, i) => {
    const angle = i * ((2 * Math.PI) / Math.max(allNodes.length, 1)) - Math.PI / 2;
    nodePositions[node] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  const edges: Edge[] = [];
  entities.forEach((e) => {
    e.connections?.forEach((c) => {
      const isRelated = hoveredNode === e.name || hoveredNode === c.target;
      edges.push({
        source: e.name,
        target: c.target,
        label: c.label,
        isActive: isRelated,
        isDimmed: hoveredNode !== null && !isRelated,
      });
    });
  });

  return (
    <div className="space-y-8">
      {/* 1. Entity Textual List */}
      <div className="space-y-1">
        {(entities || []).map((entity, i) => {
          const color = TYPE_COLORS[entity.type] || '#6b6b7a';
          const isActive = entity.name === hoveredNode;
          
          return (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.03)' }}
              onMouseEnter={() => setHoveredNode(entity.name)}
              onMouseLeave={() => setHoveredNode(null)}
              className={`group rounded-lg px-3 -mx-3 py-2 cursor-pointer transition-all border ${isActive ? 'border-war-accent/30 bg-war-accent/5' : 'border-transparent hover:border-war-border/50'}`}
            >
              <div className="flex items-center gap-2 py-1.5">
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 transition-shadow ${isActive ? 'shadow-[0_0_12px_currentColor]' : 'shadow-[0_0_4px_currentColor]'}`}
                  style={{ background: color, color: color }}
                />
                <span className={`font-syne text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-war-text group-hover:text-white'}`}>{entity.name}</span>
                <span className={`font-mono text-[10px] ml-auto transition-colors ${isActive ? 'text-war-accent' : 'text-war-muted group-hover:text-war-text'}`}>{entity.role}</span>
                <span
                  className="font-mono text-[9px] px-1.5 py-0.5 rounded-full border shadow-sm group-hover:shadow-md transition-shadow"
                  style={{ borderColor: `${color}40`, color, backgroundColor: `${color}10` }}
                >
                  {entity.type}
                </span>
              </div>
              {(entity.connections || []).map((conn, j) => (
                <div key={j} className="flex items-center gap-2 pl-4 py-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <div className="w-4 h-px bg-war-border flex-shrink-0 group-hover:bg-war-text transition-colors" />
                  <span className="font-mono text-[10px] text-war-muted italic group-hover:text-war-text/70 transition-colors">{conn.label}</span>
                  <span className="font-mono text-[10px] text-war-text">→ {conn.target}</span>
                </div>
              ))}
            </motion.div>
          );
        })}
      </div>

      {/* 2. Slideable Diagram (Mermaid) */}
      <div className="border border-war-border rounded-lg p-3 bg-war-surface flex flex-col pt-4 shadow-xl">
        <div className="flex justify-between items-center mb-3">
          <p className="font-mono text-[9px] text-war-muted uppercase tracking-widest">
            Structural Relationship Graph
          </p>
          <p className="font-mono text-[9px] text-war-accent opacity-80 animate-pulse">
            Scroll to pan &rarr;
          </p>
        </div>
        {renderError ? (
          <div className="font-mono text-xs text-war-muted">
            <p className="mb-1 text-yellow-500/70">⚠ Graph rendering unavailable</p>
            <pre className="text-[10px] whitespace-pre-wrap break-all text-war-muted/60">
              {mermaidDiagram.replace(/\\n/g, '\n')}
            </pre>
          </div>
        ) : (
          <div className="relative overflow-auto min-h-[15rem] bg-[#0a0a0b] border border-war-border/30 rounded-lg p-4 shadow-inner cursor-grab active:cursor-grabbing">
            {!svgStr && (
              <div className="shimmer rounded h-full w-full absolute inset-0 z-10 bg-war-surface" />
            )}
            {svgStr && (
              <div dangerouslySetInnerHTML={{ __html: svgStr }} className="mermaid-output min-w-max flex justify-center" />
            )}
          </div>
        )}
      </div>

      {/* 3. Global Network Map */}
      <div className="border border-war-border rounded-xl p-4 bg-war-surface shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <p className="font-mono text-[9px] text-war-muted uppercase tracking-widest">
            Global Network Map
          </p>
          <span className="font-mono text-[9px] text-war-accent opacity-80 animate-pulse">
            Hover nodes to trace paths &rarr;
          </span>
        </div>

        <div className="relative w-full h-[450px] sm:h-[550px] bg-[#0a0a0b] border border-war-border/30 rounded-lg overflow-hidden shadow-inner font-mono">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />

          {/* SVG layer for edges */}
          <svg viewBox="0 0 1000 1000" className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="35" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#2a2a30" />
              </marker>
              <marker id="arrow-active" viewBox="0 0 10 10" refX="35" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#00ff88" />
              </marker>
            </defs>

            {edges.map((edge, i) => {
              const p1 = nodePositions[edge.source];
              const p2 = nodePositions[edge.target];
              if (!p1 || !p2) return null;

              const dx = p2.x - p1.x;
              const dy = p2.y - p1.y;
              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;
              
              const factor = (i % 2 === 0 ? 0.15 : -0.15);
              const cx = midX - dy * factor;
              const cy = midY + dx * factor;

              edge.labelX = 0.25 * p1.x + 0.5 * cx + 0.25 * p2.x;
              edge.labelY = 0.25 * p1.y + 0.5 * cy + 0.25 * p2.y;

              return (
                <path
                  key={`edge-${i}`}
                  d={`M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`}
                  stroke={edge.isActive ? '#00ff88' : '#2a2a30'}
                  strokeWidth={edge.isActive ? 3 : 1.5}
                  fill="none"
                  markerEnd={edge.isActive ? 'url(#arrow-active)' : 'url(#arrow)'}
                  className={`transition-all duration-300 ${edge.isDimmed ? 'opacity-10' : 'opacity-100'}`}
                />
              );
            })}
          </svg>

          {/* Edge Labels */}
          {edges.map((edge, i) => {
            if (!edge.isActive || edge.labelX === undefined || edge.labelY === undefined) return null;
            return (
              <div
                key={`label-${i}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
                style={{ left: `${(edge.labelX / 1000) * 100}%`, top: `${(edge.labelY / 1000) * 100}%` }}
              >
                <div className="bg-[#0a0a0b] text-[8.5px] font-medium text-war-accent border border-war-accent/30 px-1.5 py-0.5 rounded whitespace-nowrap shadow-[0_0_10px_rgba(0,255,136,0.2)] backdrop-blur-sm -rotate-3">
                  {edge.label}
                </div>
              </div>
            );
          })}

          {/* Nodes */}
          {allNodes.map((node) => {
            const pos = nodePositions[node];
            const entityDef = entities.find((e) => e.name === node);
            const color = entityDef ? TYPE_COLORS[entityDef.type] || '#6b6b7a' : '#3f3f46';
            const isHovered = hoveredNode === node;
            const isConnectedToHovered = edges.some((e) => e.isActive && (e.source === node || e.target === node));
            const isDimmed = hoveredNode !== null && !isConnectedToHovered && !isHovered;

            return (
              <div
                key={node}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transition-all duration-300 ${
                  isDimmed ? 'opacity-20 scale-95' : 'opacity-100'
                } ${isHovered ? 'scale-[1.15] z-30' : 'z-20 scale-100'}`}
                style={{ left: `${(pos.x / 1000) * 100}%`, top: `${(pos.y / 1000) * 100}%` }}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className="relative flex items-center justify-center w-8 h-8 group-hover:scale-110 transition-transform">
                  {isHovered && <div className="absolute inset-0 rounded-full animate-ping opacity-40 bg-white" />}
                  <div className="w-5 h-5 rounded-full shadow-lg border border-white/10" style={{ backgroundColor: color, boxShadow: `0 0 ${isHovered ? '25px' : '10px'} ${color}` }} />
                </div>
                <div className="max-w-[120px] text-center mt-1">
                  <span className={`text-[10px] font-bold tracking-tight whitespace-normal drop-shadow-md transition-colors ${
                    isHovered ? 'text-white' : isConnectedToHovered ? 'text-war-text' : 'text-war-muted/80'
                  }`}>
                    {node}
                  </span>
                  {entityDef && isHovered && (
                    <p className="text-[8px] text-war-accent mt-0.5 leading-tight">{entityDef.role}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend & Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          {Object.entries(TYPE_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span className="font-mono text-[10px] text-war-muted capitalize">{type}</span>
            </div>
          ))}
        </div>
        <p className="font-mono text-[10px] text-war-muted opacity-50 text-right">
          Total Nodes: {allNodes.length} &bull; Detected Links: {edges.length}
        </p>
      </div>
    </div>
  );
}
