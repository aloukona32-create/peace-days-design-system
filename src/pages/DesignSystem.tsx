import { useState, type ReactNode } from 'react'
import { Button } from '../components/ui/Button'
import { Card, CardEyebrow, CardTitle, CardDescription, CardFooter } from '../components/ui/Card'
import { Label, HelperText, FieldError, Input, Textarea, Select, Checkbox } from '../components/ui/Field'
import { Badge } from '../components/ui/Badge'
import { SectionHeading } from '../components/ui/SectionHeading'

const palette = [
  { name: 'Nuit', var: 'bg-pd-night', hex: '#080E1A', on: 'text-pd-sand' },
  { name: 'Nuit 2', var: 'bg-pd-night-2', hex: '#0D1626', on: 'text-pd-sand' },
  { name: 'Nuit 3', var: 'bg-pd-night-3', hex: '#132135', on: 'text-pd-sand' },
  { name: 'Or', var: 'bg-pd-gold', hex: '#C9A227', on: 'text-pd-ink' },
  { name: 'Or clair', var: 'bg-pd-gold-bright', hex: '#E7C86B', on: 'text-pd-ink' },
  { name: 'Or sourd', var: 'bg-pd-gold-muted', hex: '#7C6A38', on: 'text-pd-ink' },
  { name: 'Sable', var: 'bg-pd-sand', hex: '#ECE4D2', on: 'text-pd-ink' },
  { name: 'Émeraude', var: 'bg-pd-emerald', hex: '#3A7A5E', on: 'text-pd-ivory' },
  { name: 'Rose', var: 'bg-pd-rose', hex: '#B5443B', on: 'text-pd-ivory' },
]

function Block({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string
  eyebrow?: string
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="border-t border-pd-gold-muted/20 py-16">
      <div className="container-pd">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-10">{children}</div>
      </div>
    </section>
  )
}

export default function DesignSystem() {
  const [loading, setLoading] = useState(false)
  const [consent, setConsent] = useState(false)
  const [showError, setShowError] = useState(false)

  return (
    <div className="pt-[var(--pd-header-h)]">
      {/* HERO */}
      <header className="container-pd py-20 text-center">
        <Badge tone="gold">Système de design</Badge>
        <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.1] text-pd-sand sm:text-6xl">
          Nuit &amp; Or
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-pd-sand/70">
          Les fondations visuelles de Doggo Management × Peace Days Dubaï 2027 : palette,
          typographie et composants.
        </p>
      </header>

      {/* PALETTE */}
      <Block id="palette" eyebrow="Fondations" title="Palette" description="Une base nuit profonde, un or à trois intensités, un sable pour le texte, et des accents de statut.">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {palette.map((c) => (
            <div key={c.name} className="overflow-hidden rounded-sm border border-pd-gold-muted/30">
              <div className={`flex h-20 items-end p-3 ${c.var} ${c.on}`}>
                <span className="text-xs font-semibold">{c.name}</span>
              </div>
              <div className="bg-pd-night-2 px-3 py-2 text-xs text-pd-sand/60">{c.hex}</div>
            </div>
          ))}
        </div>
      </Block>

      {/* TYPOGRAPHIE */}
      <Block id="typographie" eyebrow="Fondations" title="Typographie" description="Fraunces pour les titres, Manrope pour le texte courant — base 16px.">
        <div className="space-y-6">
          <p className="font-display text-5xl font-semibold text-pd-sand">Titre principal — H1</p>
          <p className="font-display text-3xl font-semibold text-pd-sand">Titre de section — H2</p>
          <p className="font-display text-xl font-semibold text-pd-sand">Titre de carte — H3</p>
          <p className="max-w-xl text-base leading-relaxed text-pd-sand/80">
            Texte courant — Manrope, 16px de base, interligne généreux.
          </p>
          <p className="text-sm text-pd-sand/60">Texte discret — légendes, aide contextuelle, mentions.</p>
        </div>
      </Block>

      {/* BOUTONS */}
      <Block id="boutons" eyebrow="Composants" title="Boutons" description="Une action principale par écran : l'or plein pour l'action principale, le contour pour l'action secondaire.">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Candidater</Button>
            <Button variant="secondary">Télécharger le dossier</Button>
            <Button variant="ghost">En savoir plus</Button>
            <Button variant="danger">Refuser</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Petit</Button>
            <Button size="md">Moyen</Button>
            <Button size="lg">Grand</Button>
            <Button loading={loading} onClick={() => setLoading((v) => !v)}>
              {loading ? 'Envoi en cours' : 'Simuler un envoi'}
            </Button>
            <Button disabled>Désactivé</Button>
          </div>
        </div>
      </Block>

      {/* CARTES */}
      <Block id="cartes" eyebrow="Composants" title="Cartes" description="Une carte « plaque » sobre pour le contenu courant, une variante « certificat » pour les temps forts.">
        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardEyebrow>Devenir exposant</CardEyebrow>
            <CardTitle>Foire des produits locaux &amp; de l'artisanat</CardTitle>
            <CardDescription>
              Candidature en plusieurs étapes, sauvegarde automatique.
            </CardDescription>
            <CardFooter>
              <Button size="sm">Candidater</Button>
              <Badge tone="neutral">18 – 25 janvier</Badge>
            </CardFooter>
          </Card>
          <Card variant="certificate">
            <CardEyebrow>Médailles de la Paix</CardEyebrow>
            <CardTitle>Cérémonie de clôture &amp; remise des médailles</CardTitle>
            <CardDescription>
              Reconnaissance des femmes, hommes et institutions qui font avancer le dialogue.
            </CardDescription>
            <CardFooter>
              <Button size="sm" variant="secondary">Réserver une table</Button>
              <Badge tone="emerald">Places disponibles</Badge>
            </CardFooter>
          </Card>
        </div>
      </Block>

      {/* FORMULAIRE */}
      <Block id="formulaire" eyebrow="Composants" title="Champs de formulaire" description="Libellé au-dessus du champ, aide contextuelle discrète, erreur explicite — pensé mobile d'abord.">
        <Card className="max-w-xl">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="prenom">Prénom</Label>
              <Input id="prenom" placeholder="Aïssatou" />
            </div>
            <div>
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" placeholder="Diallo" />
            </div>
          </div>
          <div className="mt-5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="vous@exemple.com"
              invalid={showError}
              onBlur={(e) => setShowError(e.target.value !== '' && !e.target.value.includes('@'))}
            />
            {showError ? (
              <FieldError>Vérifiez le format de votre adresse e-mail.</FieldError>
            ) : (
              <HelperText>Utilisée pour votre billet et les rappels.</HelperText>
            )}
          </div>
          <div className="mt-5">
            <Label htmlFor="pays">Pays de résidence</Label>
            <Select id="pays" defaultValue="">
              <option value="" disabled>Sélectionner un pays</option>
              <option>Émirats arabes unis</option>
              <option>Sénégal</option>
              <option>Côte d'Ivoire</option>
              <option>France</option>
            </Select>
          </div>
          <div className="mt-5">
            <Label htmlFor="message">Votre engagement pour la paix</Label>
            <Textarea id="message" placeholder="140 caractères maximum" maxLength={140} />
          </div>
          <div className="mt-5">
            <Checkbox
              id="consent"
              label="J'accepte que mon engagement soit publié après modération."
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
          </div>
          <CardFooter>
            <Button disabled={!consent}>Envoyer</Button>
          </CardFooter>
        </Card>
      </Block>

      {/* BADGES */}
      <Block id="badges" eyebrow="Composants" title="Statuts et étiquettes" description="Toujours en minuscules avec majuscule initiale — jamais tout en capitales.">
        <div className="flex flex-wrap gap-3">
          <Badge tone="gold">Invité fondateur</Badge>
          <Badge tone="emerald">Confirmé</Badge>
          <Badge tone="rose">Complet</Badge>
          <Badge tone="neutral">Liste d'attente</Badge>
        </div>
      </Block>
    </div>
  )
}
