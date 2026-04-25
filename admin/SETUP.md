# Sveltia CMS — Guia de Integração para pedropestana.com

## Visão Geral

```
pedropestana.github.io/
├── admin/
│   ├── index.html          ← entrada do CMS
│   └── config.yml          ← configuração das colecções
├── data/
│   ├── projects_en.json    ← editável pelo CMS
│   ├── projects_pt.json
│   ├── articles_en.json
│   └── articles_pt.json
└── assets/images/uploads/  ← media folder do CMS
```

---

## 1. Pré-requisitos

Já tens do NaturalMed:
- **Cloudflare Worker OAuth proxy** (reutilizável — só precisa de nova rota/config)
- **GitHub OAuth App** registada

### 1a. Criar nova GitHub OAuth App (ou reutilizar)

Se quiseres separar do NaturalMed:
1. GitHub → Settings → Developer Settings → OAuth Apps → New
2. **Homepage URL:** `https://pedropestana.com`
3. **Authorization callback URL:** `https://pp-oauth.pedropestana.workers.dev/callback`
4. Guarda `CLIENT_ID` e `CLIENT_SECRET`

### 1b. Cloudflare Worker OAuth Proxy

**Opção A — Worker dedicado** (recomendado para separação):
- Cria um novo Worker `pp-oauth` com o mesmo código do NaturalMed
- Configura as environment variables: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- Custom domain: `pp-oauth.pedropestana.workers.dev`

**Opção B — Reutilizar o Worker do NaturalMed:**
- Adiciona lógica de routing por `Origin` header ou query param
- Menos manutenção, mas acopla os dois sites

---

## 2. Formato dos JSON

O Sveltia CMS (tal como o Decap CMS) para colecções do tipo `file` espera um **objecto raiz com chave nomeada**, não um array puro.

### ✅ Formato compatível com o CMS:
```json
{
  "projects": [
    {
      "id": "postgis-monitoring",
      "title": "PostGIS Real-Time Monitoring",
      "category": "Spatial Analysis",
      "summary": "...",
      "description": "...",
      "tech_stack": ["PostGIS", "Python", "Docker"],
      "date": "2025-03-15",
      "featured": true,
      "order": 1
    }
  ]
}
```

### ❌ Formato que NÃO funciona directamente:
```json
[
  { "id": "postgis-monitoring", "title": "..." }
]
```

### Script de migração (se necessário):

```bash
# Para cada ficheiro JSON que seja array puro, envolver com chave raiz
cd /path/to/pedropestana.github.io

for f in data/projects_en.json data/projects_pt.json; do
  if python3 -c "import json,sys; d=json.load(open('$f')); sys.exit(0 if isinstance(d,list) else 1)" 2>/dev/null; then
    python3 -c "
import json
with open('$f') as fp:
    data = json.load(fp)
wrapped = {'projects': data}
with open('$f', 'w') as fp:
    json.dump(wrapped, fp, indent=2, ensure_ascii=False)
print(f'✅ Wrapped: $f')
"
  else
    echo "⏭️  Already wrapped or not array: $f"
  fi
done

for f in data/articles_en.json data/articles_pt.json; do
  if python3 -c "import json,sys; d=json.load(open('$f')); sys.exit(0 if isinstance(d,list) else 1)" 2>/dev/null; then
    python3 -c "
import json
with open('$f') as fp:
    data = json.load(fp)
wrapped = {'articles': data}
with open('$f', 'w') as fp:
    json.dump(wrapped, fp, indent=2, ensure_ascii=False)
print(f'✅ Wrapped: $f')
"
  else
    echo "⏭️  Already wrapped or not array: $f"
  fi
done
```

---

## 3. Instalação

```bash
# Copia admin/ para a raiz do repo
cp -r admin/ /path/to/pedropestana.github.io/admin/

# Cria a pasta de uploads se não existe
mkdir -p /path/to/pedropestana.github.io/assets/images/uploads

# Commit e push
cd /path/to/pedropestana.github.io
git add admin/ assets/images/uploads/
git commit -m "feat: add Sveltia CMS admin interface"
git push origin main
```

---

## 4. Configuração — O que ajustar no config.yml

### Obrigatório:
1. **`backend.repo`** — confirma que é o nome exacto do teu repo GitHub
2. **`backend.base_url`** — URL do teu Cloudflare Worker OAuth proxy
3. **`backend.branch`** — `main` ou `master`, conforme o teu repo

### Provável:
4. **Campos (fields)** — ajusta os nomes dos campos (`name`) para baterem exactamente com as chaves dos teus JSON existentes. O CMS escreve exactamente os `name` definidos.
5. **Chave raiz** — o `name` do widget list no topo (e.g. `"projects"`, `"articles"`) tem de ser a chave raiz do objecto JSON.

### Opcional:
6. **`media_folder`** — ajusta se usas outro path para imagens
7. **Categorias/options** — personaliza as listas de categorias

---

## 5. Adaptar o Frontend para ler os JSON

Se o teu JS actual faz `fetch('/data/projects_en.json')` e espera um array, precisas de ajustar:

```javascript
// ANTES (array puro):
const projects = await fetch('/data/projects_en.json').then(r => r.json());

// DEPOIS (objecto com chave raiz):
const { projects } = await fetch('/data/projects_en.json').then(r => r.json());
```

---

## 6. Testar

1. Faz push de tudo para GitHub
2. Acede a `https://pedropestana.com/admin/`
3. Login com GitHub via OAuth
4. Verifica que as 4 colecções aparecem no sidebar
5. Edita um projecto → Save → confirma que o commit aparece no GitHub
6. Verifica que o site renderiza correctamente o JSON actualizado

---

## 7. Checklist Final

- [ ] `admin/index.html` no repo
- [ ] `admin/config.yml` no repo
- [ ] GitHub OAuth App criada (ou reutilizada)
- [ ] Cloudflare Worker configurado com CLIENT_ID/SECRET
- [ ] JSON files com formato `{ "key": [...] }` (não array puro)
- [ ] `media_folder` path existe no repo
- [ ] Frontend JS adaptado para novo formato JSON (se aplicável)
- [ ] Testado login + edição + save + render
