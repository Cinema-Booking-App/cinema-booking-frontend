pipeline {
    agent any

    environment {
        REGISTRY = "docker.io"
       IMAGE_NAME = "cinema-booking-frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'feture/loctrantran',
                    url: 'https://github.com/Cinema-Booking-App/cinema-booking-frontend.git',
                    credentialsId: 'github-token'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub-cred',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        echo "🚧 Building frontend Docker image..."
                        sh '''
                            docker build \
                    --build-arg NEXT_PUBLIC_API_URL=http://136.110.0.26:8000/api/v1 \
                    -t $REGISTRY/$DOCKER_USER/$IMAGE_NAME:latest .
                        '''
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub-cred',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        echo "📦 Pushing image to Docker Hub..."
                        sh '''
                            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                            docker push $REGISTRY/$DOCKER_USER/$IMAGE_NAME:latest
                        '''
                    }
                }
            }
        }

stage('Deploy to Server') {
    steps {
        script {
            echo "🚀 Deploying frontend container to EC2..."
            // Dùng SSH credentials đã lưu trong Jenkins
            sshagent(['ec2-ssh-key']) {
                sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@16.176.178.109 '
                        cd /home/ubuntu/cinema-booking-frontend || exit
                        docker-compose pull frontend
                        docker-compose up -d frontend
                    '
                """
            }
        }
    }
}


    post {
        success {
            echo "✅ Frontend deploy thành công!"
        }
        failure {
            echo "❌ Có lỗi xảy ra trong pipeline!"
        }
    }
}
