#!groovy

@Library('cicd')_

def jobPath = env.JOB_NAME.split('/')

def wdo = [:]
wdo['jenkinsfileRepo'] = "https://bitbucket.org/zorotools/cicd.git"
wdo['jenkinsfileBranch'] = "master"
wdo['jenkinsfileFolder'] = "other/alexa"
wdo['jenkinsfile'] = "alexa_multibranch.groovy"
wdo['gitRepo'] = jobPath[-2]
wdo['gitBranch'] = jobPath[-1].replaceAll("%2F","")
wdo['jenkinsWorkspace'] = '/pub/jenkins/workspace/' + wdo['gitRepo'] + "/" + wdo['gitBranch']

echo wdo['jenkinsWorkspace']

node (wdo['jenkinsNodeLabel']) {
	ws (wdo['jenkinsWorkspace']) {
		deleteDir()

		stage ("Checkout") {
			checkout scm

			checkout([
	    	$class: 'GitSCM',
	        branches: [[name: wdo['jenkinsfileBranch']]],
	        doGenerateSubmoduleConfigurations: false,
		    extensions: [[
	        $class: 'CloneOption',
	        depth: 0,
	        noTags: false,
	        reference: '',
	        shallow: true],
            [$class: 'RelativeTargetDirectory', relativeTargetDir: '.scripts']],
	        submoduleCfg: [],
            userRemoteConfigs: [[credentialsId: '8e635635-91e3-4ce9-b2ad-8a98b210cf0a', url: wdo['jenkinsfileRepo']]]])

	      load './.scripts/' + wdo['jenkinsfileFolder'] + '/' + wdo['jenkinsfile']
	    }
	}
}