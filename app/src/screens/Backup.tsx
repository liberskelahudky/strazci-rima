import { useEffect, useRef, useState } from 'react'
import { useGame } from '../state/store'
import { exportCode, importCode, isPersisted, listBackups, requestPersistence, type SaveRecord } from '../state/persist'
import { denaru } from '../lib/format'

const when = (t: number) => new Date(t).toLocaleString('cs-CZ', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' })

function denarsOf(data: unknown) {
  const ledger = (data as { ledger?: { amount: number }[] })?.ledger ?? []
  return Math.max(0, ledger.reduce((s, e) => s + (Number(e.amount) || 0), 0))
}

// Rodičovská sekce: stav úložiště, automatické zálohy, ruční export a import
export function BackupSection() {
  const { state, total, restore } = useGame()
  const [persisted, setPersisted] = useState<boolean | null>(null)
  const [backups, setBackups] = useState<SaveRecord[]>([])
  const [code, setCode] = useState('')
  const [paste, setPaste] = useState('')
  const [msg, setMsg] = useState('')
  const [confirm, setConfirm] = useState<string | null>(null)
  const exportRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    void isPersisted().then(setPersisted)
    void listBackups().then(setBackups)
  }, [state.savedAt])

  const doRestore = (data: Record<string, unknown>, label: string) => {
    restore(data)
    setConfirm(null)
    setPaste('')
    setMsg(`Obnoveno: ${label} (${denarsOf(data)} ${denaru(denarsOf(data))}).`)
  }

  const copy = async () => {
    const c = exportCode(state)
    setCode(c)
    try {
      await navigator.clipboard.writeText(c)
      setMsg('Kód zálohy je zkopírovaný. Vložte ho třeba do poznámek nebo si ho pošlete e-mailem.')
    } catch {
      setMsg('Kód zálohy je níže. Označte ho a zkopírujte ručně.')
      setTimeout(() => exportRef.current?.select(), 50)
    }
  }

  const download = () => {
    const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '')
    const blob = new Blob([JSON.stringify(state, null, 1)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `strazci-rima-zaloha-${stamp}.json`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 2000)
  }

  const pasted = paste.trim() ? importCode(paste) : null

  return (
    <section className="card-white" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 className="kicker brown">Záloha postupu</h2>
      <p style={{ fontSize: 14, color: 'var(--ink-2)', fontWeight: 600, lineHeight: 1.5 }}>
        Postup se ukládá po každé změně do dvou míst v telefonu a každý den se dělá záloha (posledních 14 dní).
        {' '}Trvalé úložiště:{' '}
        <b style={{ color: persisted ? '#3f5a2e' : 'var(--red-text)' }}>{persisted === null ? '…' : persisted ? 'zapnuté' : 'nepotvrzené'}</b>
      </p>
      {persisted === false && (
        <>
          <p style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 600, lineHeight: 1.5 }}>
            Safari na iPhonu maže data webů, které týden neotevřete. Proto hru přidejte na plochu (Sdílet → Přidat na plochu) a hrajte z ikony. Taková aplikace se nemaže.
          </p>
          <button className="btn-sand" onClick={() => void requestPersistence().then(setPersisted)}>Požádat o trvalé úložiště</button>
        </>
      )}

      <div className="divider-title"><span>Ruční záloha</span></div>
      <p style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 600, lineHeight: 1.5 }}>
        Pro jistotu si zálohu jednou denně zkopírujte. Pomůže i při výměně nebo ztrátě telefonu: v jiném telefonu ji vložíte níže.
      </p>
      <button className="btn-dark" onClick={copy}>Zkopírovat zálohu ({total} {denaru(total)})</button>
      <button className="btn-sand" onClick={download}>Stáhnout zálohu jako soubor</button>
      {code && <textarea ref={exportRef} className="field" readOnly rows={3} value={code} style={{ fontSize: 11, fontFamily: 'monospace' }} onFocus={(e) => e.target.select()} />}

      <div className="divider-title"><span>Obnovit ze zálohy</span></div>
      <textarea id="backup-paste" className="field" rows={3} placeholder="Sem vložte kód zálohy (začíná STRAZCI1:)" value={paste} onChange={(e) => setPaste(e.target.value)} style={{ fontSize: 12 }} />
      <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={async (e) => {
        const f = e.target.files?.[0]
        if (f) setPaste(await f.text())
        e.target.value = ''
      }} />
      <button className="btn-link" style={{ alignSelf: 'flex-start' }} onClick={() => fileRef.current?.click()}>…nebo vybrat soubor se zálohou</button>
      {paste.trim() && !pasted && <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--red-text)' }}>Tohle není platná záloha. Zkontrolujte, že je vložený celý kód.</p>}
      {pasted && (
        confirm === 'paste' ? (
          <button className="btn-primary" style={{ minHeight: 52, fontSize: 16 }} onClick={() => doRestore(pasted, 'vložená záloha')}>Ano, nahradit současný postup</button>
        ) : (
          <button className="btn-dark" onClick={() => setConfirm('paste')}>Obnovit vloženou zálohu ({denarsOf(pasted)} {denaru(denarsOf(pasted))})</button>
        )
      )}

      {backups.length > 0 && (
        <>
          <div className="divider-title"><span>Automatické zálohy</span></div>
          {backups.map((b) => (
            <div key={b.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 700 }}>
                {b.key === 'before-reset' ? 'Před resetem' : when(b.savedAt)} · {denarsOf(b.data)} {denaru(denarsOf(b.data))}
              </span>
              {confirm === b.key ? (
                <button className="chip on" onClick={() => doRestore(b.data as Record<string, unknown>, b.key === 'before-reset' ? 'stav před resetem' : when(b.savedAt))}>Opravdu?</button>
              ) : (
                <button className="chip" onClick={() => setConfirm(b.key)}>Obnovit</button>
              )}
            </div>
          ))}
        </>
      )}
      {msg && <p role="status" style={{ fontSize: 14, fontWeight: 700, color: '#3f5a2e' }}>{msg}</p>}
    </section>
  )
}
