export interface Certification {
  id: string
  title: string
  issuer: string
  year?: string
  credential?: string
  topics: string[]
  /** relative path to the certificate asset if available */
  file?: string
}

/**
 * Verified knowledge library.
 * Populated only with certificates that are actually provided in the resume/files.
 * Add entries here as certificates are provided — the section renders from this array.
 */
export const certifications: Certification[] = []