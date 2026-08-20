export interface Waypoint {
  id: string
  pos: [number, number, number]
  look: [number, number, number]
}

export const WORLD_SPACING = 20

export const WAYPOINTS: Waypoint[] = [
  { id: 'hero', pos: [0, 0, 8.5], look: [0, 0, 0] },
  { id: 'about', pos: [0.25, 0.1, -11.5], look: [0, 0, -WORLD_SPACING] },
  { id: 'skills', pos: [-0.25, 0.4, -31.5], look: [0, 0, -WORLD_SPACING * 2] },
  { id: 'projects', pos: [0, 0.8, -51.5], look: [0, 0, -WORLD_SPACING * 3] },
  { id: 'experience', pos: [0.3, 0.5, -71.5], look: [0, 0, -WORLD_SPACING * 4] },
  { id: 'education', pos: [-0.3, 0.4, -91.5], look: [0, 0, -WORLD_SPACING * 5] },
  { id: 'certifications', pos: [0.2, 0.5, -111.5], look: [0, 0, -WORLD_SPACING * 6] },
  { id: 'contact', pos: [0, 0, -131.5], look: [0, 0, -WORLD_SPACING * 7] },
]

/** world z of every non-hero section (beacon placement) */
export const beaconZ = WAYPOINTS.slice(1).map((w) => w.look[2])

export const CORE_POSITION: [number, number, number] = [0, 0, 0]
export const CONTACT_CORE_POSITION: [number, number, number] = [0, 0, -WORLD_SPACING * 7]