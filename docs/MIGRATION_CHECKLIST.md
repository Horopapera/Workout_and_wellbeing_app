# Phase 5 Migration Checklist: localStorage to Supabase

This document outlines the complete migration plan from localStorage to Supabase for Phase 5.

## Pre-Migration Setup

### 1. Supabase Project Setup
- [ ] Create new Supabase project
- [ ] Configure environment variables
- [ ] Set up authentication providers
- [ ] Configure email templates

### 2. Database Schema Creation
- [ ] Run table creation scripts
- [ ] Set up Row Level Security (RLS)
- [ ] Create database indexes
- [ ] Set up database triggers
- [ ] Configure real-time subscriptions

## Data Migration Strategy

### 3. User Data Migration
- [ ] Export all user profiles from localStorage
- [ ] Migrate user authentication to Supabase Auth
- [ ] Transfer user preferences and settings
- [ ] Validate user data integrity

### 4. Application Data Migration
- [ ] Migrate food entries (logged meals)
- [ ] Transfer planned food entries (meal plans)
- [ ] Move meal templates
- [ ] Migrate workout data and routines
- [ ] Transfer custom recipes
- [ ] Move wellness entries
- [ ] Migrate notifications
- [ ] Transfer quick add entries
- [ ] Move custom foods

### 5. Data Validation
- [ ] Verify all data transferred correctly
- [ ] Check data relationships and foreign keys
- [ ] Validate user permissions and RLS policies
- [ ] Test data access patterns

## Code Migration

### 6. Service Layer Updates
- [ ] Implement SupabaseAdapter class
- [ ] Add real-time subscriptions
- [ ] Implement optimistic updates
- [ ] Add proper error handling
- [ ] Set up retry logic for failed requests

### 7. Authentication Migration
- [ ] Replace localStorage auth with Supabase Auth
- [ ] Implement proper session management
- [ ] Add password reset functionality
- [ ] Set up email verification
- [ ] Implement social login (optional)

### 8. Component Updates
- [ ] Update all components to use new data service
- [ ] Add loading states for async operations
- [ ] Implement error boundaries
- [ ] Add offline support (optional)
- [ ] Update state management

## Testing & Validation

### 9. Functionality Testing
- [ ] Test user registration and login
- [ ] Verify food logging functionality
- [ ] Test meal planning features
- [ ] Validate workout tracking
- [ ] Test recipe management
- [ ] Verify notification system
- [ ] Test data export/import

### 10. Performance Testing
- [ ] Test app performance with real database
- [ ] Verify query optimization
- [ ] Test real-time updates
- [ ] Validate caching strategies
- [ ] Test offline functionality

### 11. Security Testing
- [ ] Verify RLS policies work correctly
- [ ] Test user data isolation
- [ ] Validate authentication flows
- [ ] Test API security
- [ ] Verify data encryption

## Deployment

### 12. Production Deployment
- [ ] Set up production Supabase project
- [ ] Configure production environment variables
- [ ] Deploy application with Supabase integration
- [ ] Set up monitoring and logging
- [ ] Configure backup strategies

### 13. User Migration
- [ ] Provide data export tools for existing users
- [ ] Create migration guide for users
- [ ] Set up support for migration issues
- [ ] Monitor migration success rates

## Post-Migration

### 14. Monitoring & Maintenance
- [ ] Monitor database performance
- [ ] Track user adoption
- [ ] Monitor error rates
- [ ] Set up automated backups
- [ ] Plan for scaling

### 15. Feature Enhancements
- [ ] Implement real-time collaboration features
- [ ] Add advanced analytics
- [ ] Implement data sharing features
- [ ] Add export/import functionality
- [ ] Implement advanced search

## Database Tables to Create

### Core Tables
1. **users** - User profiles and preferences
2. **foods** - Food database (built-in + custom)
3. **food_entries** - Logged food consumption
4. **planned_food_entries** - Planned meals
5. **meal_templates** - Saved meal templates
6. **meal_template_items** - Items within meal templates

### Workout Tables
7. **workouts** - Workout routines and sessions
8. **workout_exercises** - Exercises within workouts
9. **workout_sets** - Sets within exercises
10. **exercises** - Exercise database

### Recipe Tables
11. **recipes** - Custom recipes
12. **recipe_ingredients** - Ingredients within recipes

### Wellness Tables
13. **wellness_entries** - Daily wellness tracking
14. **notifications** - User notifications
15. **quick_add_entries** - Quick nutrition entries

## RLS Policies Required

Each table needs comprehensive RLS policies:
- **SELECT**: Users can only view their own data
- **INSERT**: Users can only create data for themselves
- **UPDATE**: Users can only modify their own data
- **DELETE**: Users can only delete their own data

## Indexes for Performance

Critical indexes to create:
- `food_entries(user_id, date)` - For daily nutrition queries
- `workouts(user_id, date)` - For workout history
- `planned_food_entries(user_id, date)` - For meal planning
- `notifications(user_id, created_at)` - For notification feeds
- `foods(name)` - For food search
- `recipes(user_id, name)` - For recipe search

## Migration Timeline

**Phase 5.1** (Week 1): Database setup and schema creation
**Phase 5.2** (Week 2): Service layer implementation
**Phase 5.3** (Week 3): Authentication migration
**Phase 5.4** (Week 4): Component updates and testing
**Phase 5.5** (Week 5): Production deployment and user migration

## Rollback Plan

In case of issues:
1. Keep localStorage implementation as fallback
2. Implement feature flags to switch between storage methods
3. Maintain data export functionality
4. Have database backup and restore procedures
5. Plan for gradual rollout to minimize risk

## Success Metrics

- [ ] 100% data migration success rate
- [ ] <2s average page load time
- [ ] <1% error rate in production
- [ ] 95%+ user satisfaction with migration
- [ ] Zero data loss incidents