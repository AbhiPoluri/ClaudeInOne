# Ruby on Rails

Convention-over-configuration framework for rapid web application development.

## Scaffolding & Models

```bash
rails generate scaffold User name:string email:string age:integer
```

```ruby
# app/models/user.rb
class User < ApplicationRecord
  has_many :posts
  validates :name, :email, presence: true
  validates :email, uniqueness: true
  
  before_save :downcase_email
  
  def full_email
    "#{name} <#{email}>"
  end
  
  private
  
  def downcase_email
    self.email = email.downcase
  end
end
```

## Routes & Controllers

```ruby
# config/routes.rb
Rails.application.routes.draw do
  resources :users
  resources :posts do
    resources :comments
  end
  
  get 'dashboard', to: 'dashboard#index'
  post 'login', to: 'sessions#create'
end

# app/controllers/users_controller.rb
class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  
  def index
    @users = User.all
  end
  
  def show
    @posts = @user.posts
  end
  
  def create
    @user = User.new(user_params)
    if @user.save
      redirect_to @user, notice: 'User created'
    else
      render :new, status: :unprocessable_entity
    end
  end
  
  private
  
  def set_user
    @user = User.find(params[:id])
  end
  
  def user_params
    params.require(:user).permit(:name, :email, :age)
  end
end
```

## Views (ERB)

```erb
<!-- app/views/users/show.html.erb -->
<h1><%= @user.name %></h1>
<p><%= @user.email %></p>

<h2>Posts</h2>
<% if @user.posts.any? %>
  <ul>
    <% @user.posts.each do |post| %>
      <li><%= link_to post.title, post %></li>
    <% end %>
  </ul>
<% else %>
  <p>No posts yet</p>
<% end %>

<%= link_to 'Edit', edit_user_path(@user) %>
<%= link_to 'Delete', user_path(@user), method: :delete, data: { confirm: 'Are you sure?' } %>
```

## ActiveRecord Queries

```ruby
# Find
user = User.find(1)
user = User.find_by(email: 'john@example.com')
users = User.where(age: 18..65)

# Create
user = User.create(name: 'John', email: 'john@example.com')
user = User.new(name: 'Jane')
user.save

# Update
user.update(name: 'Jane')
User.update_all(verified: true)

# Delete
user.destroy
User.delete_all

# Eager loading
users = User.includes(:posts)
users = User.preload(:posts)

# Aggregation
User.count
User.group(:age).count
User.where('age > ?', 18).average(:age)
```

## Background Jobs (Active Job)

```ruby
class WelcomeEmailJob < ApplicationJob
  queue_as :default
  
  def perform(user)
    UserMailer.welcome(user).deliver_later
  end
end

# Queue the job
WelcomeEmailJob.perform_later(user)
WelcomeEmailJob.set(wait: 1.hour).perform_later(user)
```

## Testing with RSpec

```ruby
require 'rails_helper'

RSpec.describe User, type: :model do
  it { should validate_presence_of(:name) }
  it { should validate_uniqueness_of(:email) }
  
  describe '#full_email' do
    it 'returns formatted email' do
      user = User.create(name: 'John', email: 'john@example.com')
      expect(user.full_email).to eq('John <john@example.com>')
    end
  end
end

RSpec.describe UsersController, type: :controller do
  describe 'GET #show' do
    it 'returns the user' do
      user = User.create(name: 'John', email: 'john@example.com')
      get :show, params: { id: user.id }
      expect(response).to be_successful
    end
  end
end
```

## Best Practices

1. **Use generators for scaffolding**
2. **Keep models fat, controllers thin**
3. **Use scopes for common queries**
4. **Implement proper validations**
5. **Use background jobs for heavy operations**
6. **Write comprehensive tests**
7. **Use migrations for schema changes**

## Resources

- [Rails Guides](https://guides.rubyonrails.org/)
- [Active Record Documentation](https://guides.rubyonrails.org/active_record_basics.html)
- [Rails Testing Guide](https://guides.rubyonrails.org/testing.html)
