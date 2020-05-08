pipeline {
    agent { docker { image 'python:3.5.1' } }
    stages {
        stage('build') {
            steps 
            {
                retry(3) 
                {
                    sh 'echo "Hello, Jenkins"'
                    sh 'ls'
                }
             }
            }
            
        stage('test') {
            steps {
                sh 'echo "Testing"'
            }
        }
    }
}
