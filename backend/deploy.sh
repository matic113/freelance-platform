#!/bin/bash

# Freelancer Platform Deployment Script
# This script handles the complete deployment process

set -e

# Configuration
APP_NAME="freint"
DOCKER_IMAGE="freint:latest"
DOCKER_CONTAINER="freint-container"
DOCKER_COMPOSE_FILE="docker-compose.yml"
BACKUP_DIR="/backups"
LOG_FILE="/var/log/freint-deployment.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a $LOG_FILE
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a $LOG_FILE
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root"
        exit 1
    fi
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if Maven is installed
    if ! command -v mvn &> /dev/null; then
        error "Maven is not installed. Please install Maven first."
        exit 1
    fi
    
    # Check if Java is installed
    if ! command -v java &> /dev/null; then
        error "Java is not installed. Please install Java 17 or higher first."
        exit 1
    fi
    
    log "All prerequisites are satisfied."
}

# Backup existing data
backup_data() {
    log "Creating backup of existing data..."
    
    if [ -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR/$(date +%Y%m%d_%H%M%S)"
        BACKUP_PATH="$BACKUP_DIR/$(date +%Y%m%d_%H%M%S)"
    else
        mkdir -p "$BACKUP_DIR"
        BACKUP_PATH="$BACKUP_DIR/$(date +%Y%m%d_%H%M%S)"
    fi
    
    # Backup database if container exists
    if docker ps -a --format 'table {{.Names}}' | grep -q "postgres"; then
         log "Backing up PostgreSQL database..."
         docker exec postgres pg_dump -U postgres freint > "$BACKUP_PATH/database_backup.sql"
    fi
    
    # Backup uploaded files
    if [ -d "uploads" ]; then
        log "Backing up uploaded files..."
        cp -r uploads "$BACKUP_PATH/"
    fi
    
    log "Backup completed at $BACKUP_PATH"
}

# Build the application
build_application() {
    log "Building the application..."
    
    # Clean and compile
    mvn clean compile
    
    # Run tests
    log "Running tests..."
    mvn test
    
    if [ $? -ne 0 ]; then
        error "Tests failed. Deployment aborted."
        exit 1
    fi
    
    # Package the application
    log "Packaging the application..."
    mvn package -DskipTests
    
    log "Application built successfully."
}

# Build Docker image
build_docker_image() {
    log "Building Docker image..."
    
    docker build -t $DOCKER_IMAGE .
    
    if [ $? -ne 0 ]; then
        error "Docker image build failed."
        exit 1
    fi
    
    log "Docker image built successfully."
}

# Stop existing containers
stop_containers() {
    log "Stopping existing containers..."
    
    # Stop application container
    if docker ps -q -f name=$DOCKER_CONTAINER | grep -q .; then
        docker stop $DOCKER_CONTAINER
        docker rm $DOCKER_CONTAINER
    fi
    
    # Stop all services using docker-compose
    if [ -f "$DOCKER_COMPOSE_FILE" ]; then
        docker-compose down
    fi
    
    log "Containers stopped."
}

# Start services
start_services() {
    log "Starting services..."
    
    # Start infrastructure services
    docker-compose up -d postgres redis elasticsearch
    
    # Wait for services to be ready
    log "Waiting for services to be ready..."
    sleep 30
    
    # Start the application
    docker-compose up -d app
    
    log "Services started successfully."
}

# Health check
health_check() {
    log "Performing health check..."
    
    # Wait for application to start
    sleep 60
    
    # Check if application is responding
    for i in {1..30}; do
        if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
            log "Application is healthy and responding."
            return 0
        fi
        log "Waiting for application to start... ($i/30)"
        sleep 10
    done
    
    error "Application health check failed."
    return 1
}

# Cleanup old images
cleanup() {
    log "Cleaning up old Docker images..."
    
    # Remove dangling images
    docker image prune -f
    
    # Remove old versions of the application image
    docker images $APP_NAME --format "table {{.Repository}}:{{.Tag}}\t{{.CreatedAt}}" | \
    awk 'NR>1 {print $1}' | \
    tail -n +2 | \
    xargs -r docker rmi
    
    log "Cleanup completed."
}

# Main deployment function
deploy() {
    log "Starting deployment process..."
    
    check_root
    check_prerequisites
    backup_data
    build_application
    build_docker_image
    stop_containers
    start_services
    
    if health_check; then
        cleanup
        log "Deployment completed successfully!"
        log "Application is available at: http://localhost:8080"
        log "API documentation: http://localhost:8080/swagger-ui.html"
        log "Health check: http://localhost:8080/api/health"
    else
        error "Deployment failed during health check."
        exit 1
    fi
}

# Rollback function
rollback() {
    log "Starting rollback process..."
    
    stop_containers
    
    # Find the latest backup
    LATEST_BACKUP=$(ls -t $BACKUP_DIR | head -n1)
    
    if [ -z "$LATEST_BACKUP" ]; then
        error "No backup found for rollback."
        exit 1
    fi
    
    log "Rolling back to backup: $LATEST_BACKUP"
    
    # Restore database
    if [ -f "$BACKUP_DIR/$LATEST_BACKUP/database_backup.sql" ]; then
         log "Restoring database..."
         docker-compose up -d postgres
         sleep 30
         docker exec -i postgres psql -U postgres freint < "$BACKUP_DIR/$LATEST_BACKUP/database_backup.sql"
    fi
    
    # Restore files
    if [ -d "$BACKUP_DIR/$LATEST_BACKUP/uploads" ]; then
        log "Restoring uploaded files..."
        cp -r "$BACKUP_DIR/$LATEST_BACKUP/uploads" .
    fi
    
    # Start services with previous version
    docker-compose up -d
    
    log "Rollback completed."
}

# Show usage
usage() {
    echo "Usage: $0 {deploy|rollback|status|logs}"
    echo ""
    echo "Commands:"
    echo "  deploy   - Deploy the application"
    echo "  rollback - Rollback to previous version"
    echo "  status   - Show application status"
    echo "  logs     - Show application logs"
}

# Show status
show_status() {
    log "Application Status:"
    echo ""
    echo "Docker Containers:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    echo "Application Health:"
    curl -s http://localhost:8080/api/health | jq .
}

# Show logs
show_logs() {
    log "Application Logs:"
    docker-compose logs -f app
}

# Main script logic
case "$1" in
    deploy)
        deploy
        ;;
    rollback)
        rollback
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    *)
        usage
        exit 1
        ;;
esac
