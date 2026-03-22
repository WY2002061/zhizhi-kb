import { useRef, useEffect, useState, useCallback } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Info } from 'lucide-react';
import { useKnowledgeStore } from '../store/knowledgeStore';
import { useUIStore } from '../store/uiStore';

interface GraphNode {
  id: string;
  label: string;
  type: 'card' | 'tag' | 'collection';
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface GraphEdge {
  source: string;
  target: string;
}

export default function GraphView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cards = useKnowledgeStore((s) => s.cards);
  const collections = useKnowledgeStore((s) => s.collections);
  const openCardDetail = useUIStore((s) => s.openCardDetail);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const nodesRef = useRef<GraphNode[]>([]);
  const edgesRef = useRef<GraphEdge[]>([]);
  const animRef = useRef<number>(0);
  const draggingRef = useRef<{ node: GraphNode | null; offsetX: number; offsetY: number }>({ node: null, offsetX: 0, offsetY: 0 });
  const panRef = useRef<{ active: boolean; startX: number; startY: number; startOffsetX: number; startOffsetY: number }>({ active: false, startX: 0, startY: 0, startOffsetX: 0, startOffsetY: 0 });

  const publicCards = cards.filter((c) => c.privacyLevel !== 'secret');

  const buildGraph = useCallback(() => {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const tagSet = new Set<string>();
    const w = containerRef.current?.clientWidth || 800;
    const h = containerRef.current?.clientHeight || 600;
    const cx = w / 2;
    const cy = h / 2;

    for (const col of collections) {
      nodes.push({
        id: `col-${col.id}`,
        label: `${col.icon} ${col.name}`,
        type: 'collection',
        color: col.color,
        x: cx + (Math.random() - 0.5) * 300,
        y: cy + (Math.random() - 0.5) * 300,
        vx: 0, vy: 0,
        radius: 24,
      });
    }

    for (const card of publicCards) {
      nodes.push({
        id: `card-${card.id}`,
        label: card.title.length > 12 ? card.title.slice(0, 12) + '...' : card.title,
        type: 'card',
        color: '#6366F1',
        x: cx + (Math.random() - 0.5) * 400,
        y: cy + (Math.random() - 0.5) * 400,
        vx: 0, vy: 0,
        radius: 8 + Math.min(card.reviewCount * 2, 10),
      });

      if (card.collectionId) {
        edges.push({ source: `card-${card.id}`, target: `col-${card.collectionId}` });
      }

      for (const tag of card.tags) {
        if (!tagSet.has(tag)) {
          tagSet.add(tag);
          nodes.push({
            id: `tag-${tag}`,
            label: tag,
            type: 'tag',
            color: '#10B981',
            x: cx + (Math.random() - 0.5) * 350,
            y: cy + (Math.random() - 0.5) * 350,
            vx: 0, vy: 0,
            radius: 6,
          });
        }
        edges.push({ source: `card-${card.id}`, target: `tag-${tag}` });
      }
    }

    nodesRef.current = nodes;
    edgesRef.current = edges;
  }, [publicCards, collections]);

  const simulate = useCallback(() => {
    const nodes = nodesRef.current;
    const edges = edgesRef.current;
    const w = containerRef.current?.clientWidth || 800;
    const h = containerRef.current?.clientHeight || 600;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = 800 / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        nodes[i].vx -= fx;
        nodes[i].vy -= fy;
        nodes[j].vx += fx;
        nodes[j].vy += fy;
      }
    }

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    for (const edge of edges) {
      const s = nodeMap.get(edge.source);
      const t = nodeMap.get(edge.target);
      if (!s || !t) continue;
      const dx = t.x - s.x;
      const dy = t.y - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = (dist - 120) * 0.005;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      s.vx += fx;
      s.vy += fy;
      t.vx -= fx;
      t.vy -= fy;
    }

    for (const node of nodes) {
      node.vx += (w / 2 - node.x) * 0.0005;
      node.vy += (h / 2 - node.y) * 0.0005;
      node.vx *= 0.9;
      node.vy *= 0.9;
      if (draggingRef.current.node?.id !== node.id) {
        node.x += node.vx;
        node.y += node.vy;
      }
      node.x = Math.max(30, Math.min(w - 30, node.x));
      node.y = Math.max(30, Math.min(h - 30, node.y));
    }
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    const nodeMap = new Map(nodesRef.current.map((n) => [n.id, n]));

    for (const edge of edgesRef.current) {
      const s = nodeMap.get(edge.source);
      const t = nodeMap.get(edge.target);
      if (!s || !t) continue;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(t.x, t.y);
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    for (const node of nodesRef.current) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      const isHovered = hoveredNode?.id === node.id;

      if (node.type === 'collection') {
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color + '40';
        ctx.shadowBlur = isHovered ? 16 : 8;
      } else if (node.type === 'card') {
        ctx.fillStyle = isHovered ? '#4F46E5' : '#818CF8';
        ctx.shadowColor = '#6366F140';
        ctx.shadowBlur = isHovered ? 12 : 4;
      } else {
        ctx.fillStyle = isHovered ? '#059669' : '#34D399';
        ctx.shadowBlur = 0;
      }

      ctx.fill();
      ctx.shadowBlur = 0;

      if (node.type !== 'tag' || isHovered) {
        ctx.fillStyle = node.type === 'tag' ? '#065F46' : '#1E293B';
        ctx.font = node.type === 'collection' ? 'bold 11px "Noto Sans SC", sans-serif' : '10px "Noto Sans SC", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + node.radius + 14);
      }
    }

    ctx.restore();

    simulate();
    animRef.current = requestAnimationFrame(draw);
  }, [zoom, offset, hoveredNode, simulate]);

  useEffect(() => {
    buildGraph();
  }, [buildGraph]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom((z) => Math.max(0.3, Math.min(3, z * delta)));
    };
    canvas.addEventListener('wheel', onWheel, { passive: false });

    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  const getNodeAt = (mx: number, my: number): GraphNode | null => {
    const x = (mx - offset.x) / zoom;
    const y = (my - offset.y) / zoom;
    for (const node of [...nodesRef.current].reverse()) {
      const dx = node.x - x;
      const dy = node.y - y;
      if (dx * dx + dy * dy <= (node.radius + 4) * (node.radius + 4)) {
        return node;
      }
    }
    return null;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (draggingRef.current.node) {
      const node = draggingRef.current.node;
      node.x = (mx - offset.x) / zoom - draggingRef.current.offsetX;
      node.y = (my - offset.y) / zoom - draggingRef.current.offsetY;
      return;
    }

    if (panRef.current.active) {
      setOffset({
        x: panRef.current.startOffsetX + (mx - panRef.current.startX),
        y: panRef.current.startOffsetY + (my - panRef.current.startY),
      });
      return;
    }

    const node = getNodeAt(mx, my);
    setHoveredNode(node);
    if (canvasRef.current) {
      canvasRef.current.style.cursor = node ? 'pointer' : 'grab';
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const node = getNodeAt(mx, my);

    if (node) {
      draggingRef.current = {
        node,
        offsetX: (mx - offset.x) / zoom - node.x,
        offsetY: (my - offset.y) / zoom - node.y,
      };
    } else {
      panRef.current = { active: true, startX: mx, startY: my, startOffsetX: offset.x, startOffsetY: offset.y };
    }
  };

  const handleMouseUp = () => {
    if (draggingRef.current.node) {
      draggingRef.current = { node: null, offsetX: 0, offsetY: 0 };
    }
    panRef.current.active = false;
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const node = getNodeAt(mx, my);
    if (node?.type === 'card') {
      openCardDetail(node.id.replace('card-', ''));
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-10 h-full flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">知识图谱</h1>
          <p className="text-[15px] text-stone-500 mt-1.5 font-bold">可视化你的知识关联网络</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-theme-border shadow-sm">
          <button onClick={() => setZoom((z) => Math.min(3, z * 1.2))} className="p-2.5 rounded-lg text-stone-500 hover:bg-stone-50 hover:text-stone-700 transition-colors">
            <ZoomIn size={18} />
          </button>
          <button onClick={() => setZoom((z) => Math.max(0.3, z * 0.8))} className="p-2.5 rounded-lg text-stone-500 hover:bg-stone-50 hover:text-stone-700 transition-colors">
            <ZoomOut size={18} />
          </button>
          <button onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }} className="p-2.5 rounded-lg text-stone-500 hover:bg-stone-50 hover:text-stone-700 transition-colors">
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6 text-[14px] text-stone-500 font-bold flex-shrink-0 bg-white px-5 py-3 rounded-xl border border-theme-border w-fit shadow-sm">
        <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full bg-indigo-400 inline-block shadow-sm" /> 知识卡片</span>
        <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full bg-emerald-400 inline-block shadow-sm" /> 标签</span>
        <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full bg-rose-400 inline-block shadow-sm" /> 知识集</span>
        <span className="flex items-center gap-2 text-stone-400 ml-5 border-l-2 border-stone-100 pl-6"><Info size={16} /> 双击卡片节点查看详情</span>
      </div>

      <div ref={containerRef} className="flex-1 bg-white rounded-3xl border border-theme-border shadow-sm overflow-hidden relative min-h-[500px]">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onDoubleClick={handleDoubleClick}
          className="w-full h-full"
        />
        {hoveredNode && (
          <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md border border-stone-200 rounded-2xl px-5 py-3 shadow-xl animate-fadeIn">
            <p className="text-base font-bold text-stone-800">{hoveredNode.label}</p>
            <p className="text-sm text-stone-500 capitalize mt-0.5 font-medium">{hoveredNode.type === 'card' ? '知识卡片' : hoveredNode.type === 'tag' ? '标签' : '知识集'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
