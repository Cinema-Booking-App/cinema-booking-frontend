pipeline {
    agent any

    environment {
        REGISTRY = "docker.io"
        IMAGE_NAME = "cinema-booking-frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'dev',
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
                    echo "🚀 Deploying frontend container..."

                    sh '''
                        cd /home/phamvantinh27032004/jenkins

                        echo "Pulling latest image..."
                        docker-compose pull frontend

                        echo "Recreating container..."
                        docker-compose up -d frontend

                        echo "Cleaning unused docker images..."
                        docker image prune -f
                    '''
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
