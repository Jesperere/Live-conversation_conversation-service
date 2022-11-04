# Conversation service 

This is a web service application to read and write messages from and to users.
    

## EXPORTED STEPS FROM CONVERSATION-SERVICE PIPELINE (YAML):

### DOCKER BUILD:
```
steps:
- task: Docker@2
  displayName: 'Docker Build'
  inputs:
    containerRegistry: 'CICD-ACR'
    repository: 'live-conversation/conversation-service'
    command: build
    tags: '$(Build.SourceVersion)'
```

### DOCKER PUSH:
```
steps:
- task: Docker@2
  displayName: 'Docker Push'
  inputs:
    containerRegistry: 'CICD-ACR'
    repository: 'live-conversation/conversation-service'
    command: push
    tags: '$(Build.SourceVersion)'
```


### SETTING IMAGE TAG:
```
steps:
- bash: |
   #### replace tag in kust-file with git-commit hash-value
   export IMAGE_TAG=$(git rev-parse HEAD)
   envsubst \
       < infra/base/kustomization.template.yaml \
       > infra/base/kustomization.yaml
  displayName: 'Setting image tag'
```


### KUSTOMIZE (ENVIRONMENTS):
```
steps:
- powershell: |
   #### DEV
   #### Create dir on-cloud:
   mkdir $(Build.ArtifactStagingDirectory)/resources
   
   #### Create sub-dir (Dev) on-cloud:
   mkdir $(Build.ArtifactStagingDirectory)/resources/dev
   
   #### Build the Dev-dir (from repo) > save the build on-cloud as 'apply.yaml' (Dev-dir):
   kustomize build $(Build.SourcesDirectory)/infra/overlays/dev > $(Build.ArtifactStagingDirectory)/resources/dev/apply.yaml
   
   
   #### Same for QA:
   mkdir $(Build.ArtifactStagingDirectory)/resources/qa
   kustomize build $(Build.SourcesDirectory)/infra/overlays/qa > $(Build.ArtifactStagingDirectory)/resources/qa/apply.yaml
   
   #### Same for Prod:
   mkdir $(Build.ArtifactStagingDirectory)/resources/prod
   kustomize build $(Build.SourcesDirectory)/infra/overlays/prod > $(Build.ArtifactStagingDirectory)/resources/prod/apply.yaml
  displayName: 'Kustomize (environments)'
```


### PUBLISH ARTIFACT:
```
steps:
- task: PublishPipelineArtifact@1
  displayName: 'Publish Pipeline Artifact'
  inputs:
    targetPath: '$(Build.ArtifactStagingDirectory)/resources'
    artifact: Deploy
```
