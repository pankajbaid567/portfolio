// Skills matched to projects: a chip filters the Work section by that technology. "proof" lists the projects that use it.
export const skillGroups = [
  { label: 'Languages', items: ['Go', 'Python', 'TypeScript', 'JavaScript', 'Java', 'SQL', 'C++'] },
  { label: 'Backend & data', items: ['PostgreSQL', 'Redis', 'MongoDB', 'Node.js', 'Express', 'Fastify', 'FastAPI', 'Spring Boot', 'Prisma', 'REST design'] },
  { label: 'Systems', items: ['Write-ahead logs', 'LSM trees', 'Idempotency', 'Transactional outbox', 'Crash & fault testing', 'Mutation testing', 'Property-based testing'] },
  { label: 'AI & LLM', items: ['RAG', 'LangGraph', 'LangChain', 'MCP', 'Hugging Face', 'PyTorch', 'Agent evaluation'] },
  { label: 'Frontend & mobile', items: ['React', 'Next.js', 'React Native', 'Redux', 'Tailwind'] },
  { label: 'Infra & tooling', items: ['Docker', 'GitHub Actions', 'Cloudflare Workers', 'Render', 'Neon', 'AWS EC2', 'k6', 'Linux'] },
]

// Which chip maps to which project tech strings (case-insensitive substring match against project stacks).
export const skillAliases = {
  Go: ['go'],
  Python: ['python'],
  TypeScript: ['typescript'],
  JavaScript: ['javascript'],
  Java: ['java 21'],
  SQL: ['sql', 'postgresql'],
  'C++': [],
  PostgreSQL: ['postgresql'],
  Redis: ['redis'],
  MongoDB: ['mongodb'],
  'Node.js': ['node.js'],
  Express: ['express'],
  Fastify: ['fastify'],
  FastAPI: ['fastapi'],
  'Spring Boot': ['spring boot'],
  Prisma: ['prisma'],
  React: ['react'],
  'Next.js': ['next.js'],
  'React Native': ['react native'],
  Docker: ['docker'],
  'GitHub Actions': ['github actions'],
  'Cloudflare Workers': ['cloudflare'],
  Render: ['render'],
  Neon: ['neon'],
  'AWS EC2': ['aws ec2'],
  k6: ['k6'],
  LangGraph: ['langgraph'],
  LangChain: ['langchain'],
  MCP: ['mcp'],
  PyTorch: ['pytorch'],
  Redux: [],
  Tailwind: [],
  Linux: [],
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
/** True if the project stack mentions the skill as a whole word (so "go" does not match "MongoDB"). */
export function skillMatches(name, stackText) {
  const al = skillAliases[name]
  if (!al || al.length === 0) return false
  return al.some((a) => new RegExp(`(^|[^a-z0-9+#])${esc(a)}([^a-z0-9+#]|$)`, 'i').test(stackText))
}
