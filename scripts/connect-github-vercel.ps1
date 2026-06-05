# Connect BoringBrush to GitHub and Vercel Git auto-deploy.
# Run from project root after: gh auth login

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

gh auth status | Out-Null

if (-not (git branch --list main)) {
  git branch -M main
}

$repoName = "boringbrush"
$owner = (gh api user -q .login)
$remote = "https://github.com/$owner/$repoName.git"

if (-not (gh repo view "$owner/$repoName" 2>$null)) {
  gh repo create $repoName --public --source=. --remote=origin --description "BoringBrush — 3D printed, hand-painted avatar collectibles"
} else {
  if (-not (git remote get-url origin 2>$null)) {
    git remote add origin $remote
  }
}

git push -u origin main

npx vercel git connect $remote --yes

Write-Host ""
Write-Host "Done. GitHub: https://github.com/$owner/$repoName"
Write-Host "Vercel will auto-deploy on every push to main."
