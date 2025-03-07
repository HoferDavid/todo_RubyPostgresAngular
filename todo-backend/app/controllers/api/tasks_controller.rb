class Api::TasksController < ApplicationController
  skip_before_action :verify_authenticity_token # deactivate CSRF protection

  def index
    @tasks = Task.all
    render json: @tasks
  end

  def create
    @task = Task.new(task_params)
    if @task.save
      render json: @task, status: :created
    else
      render json: @task.errors, status: :unprocessable_entity
    end
  end

  # Delete a task by ID
  def destroy
    @task = Task.find(params[:id])
    @task.destroy
    head :no_content # Return 204 No Content status
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Task not found" }, status: :not_found
  end

  # Update a task by ID (e.g., toggle completed status)
  def update
    @task = Task.find(params[:id])
    if @task.update(task_params)
      render json: @task
    else
      render json: @task.errors, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Task not found" }, status: :not_found
  end

  private

  def task_params
    params.require(:task).permit(:title, :completed)
  end
end
