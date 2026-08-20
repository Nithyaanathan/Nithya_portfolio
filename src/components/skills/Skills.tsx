import { useState } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { SkillNetwork } from '@/components/three/SkillNetwork'
import { skillClusters, type SkillNode } from '@/data/skills'
import { useTheme } from '@/lib/theme'
import { getColorSet } from '@/lib/colors'
import { usePrefersReducedMotion, useWebGL } from '@/lib/device'

export function Skills() {
  const { theme } = useTheme()
  const colors = getColorSet(theme)
  const reduced = usePrefersReducedMotion()
  const webgl = useWebGL()

  const [node, setNode] = useState<SkillNode | null>(null)
  const [clusterName, setClusterName] = useState('')
  const [selectedCluster, setSelectedCluster] = useState(skillClusters[0].id)

  const activeCluster = skillClusters.find((c) => c.id === selectedCluster) ?? skillClusters[0]

  return (
    <section id="skills" className="relative z-10 py-28 md:py-40">
      <div className="container-shell pointer-events-none">
        <SectionHeading
          id="skills-heading"
          index="02"
          title="INTELLIGENCE LAYER"
          description="My capabilities organised as a living neural system — every skill is a node connected to a cluster it belongs to."
        />

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <Reveal>
            <div className="pointer-events-auto relative">
              <div className="pointer-events-none absolute inset-0 grid-overlay opacity-60" aria-hidden />
              {webgl ? (
                <SkillNetwork colors={colors} reduced={reduced} onHover={(n, c) => {
                  if (n) {
                    setNode(n)
                    setClusterName(c)
                    const cl = skillClusters.find((x) => x.name === c)
                    if (cl) setSelectedCluster(cl.id)
                  } else {
                    setNode(null)
                    setClusterName('')
                  }
                }} />
              ) : (
                <div className="flex h-[420px] items-center justify-center rounded-2xl border border-line bg-panel sm:h-[520px]">
                  <p className="hud-label">NEURAL VISUALISER OFFLINE // SKILL MATRIX BELOW</p>
                </div>
              )}
            </div>
          </Reveal>

          <div>
            <Reveal delay={0.1}>
              <div className="glass holo-edge rounded-2xl p-6 sm:p-8">
                <p className="hud-label text-accent">
                  {node ? 'NODE DETECTED' : 'INTERACT WITH THE NETWORK'}
                </p>
                <p className="mt-4 font-display text-2xl font-semibold text-ink">
                  {node ? node.label : activeCluster.name}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-dim">
                  {node ? node.description : activeCluster.nodes[0].description}
                </p>
                {node && (
                  <p className="mono-meta mt-4 text-accent/70">CLUSTER // {clusterName}</p>
                )}
              </div>
            </Reveal>

            <div className="mt-4 flex flex-wrap gap-2">
              {skillClusters.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedCluster(c.id)
                    setNode(c.nodes[0])
                    setClusterName(c.name)
                  }}
                  className={`pointer-events-auto rounded-full border px-4 py-2 font-mono text-[10px] tracking-[0.18em] transition-all ${
                    selectedCluster === c.id
                      ? 'border-accent/60 bg-accent/10 text-accent'
                      : 'border-line bg-panel text-dim hover:border-accent/30 hover:text-ink'
                  }`}
                >
                  {c.code} // {c.name}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <p className="hud-label mb-3">SKILLS IN THIS CLUSTER</p>
              <div className="flex flex-wrap gap-2">
                {(node ? skillClusters.find((c) => c.name === clusterName)?.nodes ?? activeCluster.nodes : activeCluster.nodes).map(
                  (s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => {
                        setNode(s)
                        setClusterName(activeCluster.name)
                      }}
                      className={`pointer-events-auto rounded-md border px-3 py-1.5 text-xs transition-colors ${
                        node?.label === s.label
                          ? 'border-accent/60 bg-accent/10 text-accent'
                          : 'border-line bg-panel text-dim hover:text-ink'
                      }`}
                    >
                      {s.label}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}