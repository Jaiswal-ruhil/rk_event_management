# GitHub Copilot Instructions for Event Manager PWA

## Project Overview
This is a Progressive Web App (PWA) for managing banquet hall events and services. It helps track service completion, assign contacts to tasks, and monitor overall event progress.

## Tech Stack
- **Frontend**: React (via CDN, no build process)
- **Styling**: Tailwind CSS (via CDN)
- **Storage**: LocalStorage for data persistence
- **Architecture**: Single HTML file with inline JavaScript

## Code Style & Conventions

### React Patterns
- Use functional components only
- Use hooks (useState, useEffect) for state management
- Keep components small and focused on single responsibility
- Use inline JSX (no separate component files)

### Naming Conventions
- **Components**: PascalCase (e.g., `ContactSelector`, `ServiceItem`)
- **Functions**: camelCase (e.g., `toggleService`, `getRoleColor`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `SERVICES_DATA`, `ROLE_OPTIONS`)
- **State variables**: camelCase (e.g., `serviceStatuses`, `assignedContacts`)

### State Management
- All state stored in main `BanquetEventApp` component
- Use localStorage for persistence
- State structure:
  - `serviceStatuses`: Object with keys like `"core-Hall Rental"` and values `"completed"` | `"not-required"` | undefined
  - `assignedContacts`: Object with same keys, values are arrays of contact objects
  - Contact object: `{ id: string, name: string, phone: string, role?: string }`

### Data Structures
```javascript
// Service status key format
const key = `${categoryKey}-${serviceName}`;

// Contact object
const contact = {
  id: string,        // Timestamp-based unique ID
  name: string,      // Required
  phone: string,     // Required
  role: string       // Optional, one of ROLE_OPTIONS ids
};

// Service object
const service = {
  name: string,
  deps: string[]     // Array of dependency service names
};
```

## Component Guidelines

### ServiceItem Component
- Handles individual service display and interactions
- Three actions: toggle completion, assign contacts, mark not required
- Shows contact badges with role-based colors
- Uses event.stopPropagation() to prevent parent clicks

### ContactSelector Modal
- Modal for adding/editing contacts for a service
- Supports multiple contacts per service
- Role selection is optional
- Validates name and phone are required

### CategorySection Component
- Expandable/collapsible category container
- Shows progress for category (completed/applicable services)
- Calculates applicable as total minus not-required services

## Mobile-First Considerations
- Use larger touch targets (min 44px height for buttons)
- Use `active:opacity-70` instead of `hover:` for touch feedback
- Test all interactions with touch gestures
- Use `-webkit-tap-highlight-color: transparent` to remove tap highlights
- Consider safe areas for iOS notches

## PWA Requirements
- Must include viewport meta tag with `user-scalable=no`
- Must include manifest with app metadata
- Must register service worker for offline support
- Must include apple-mobile-web-app-* meta tags for iOS
- Must use theme-color meta tag

## LocalStorage Schema
```javascript
{
  serviceStatuses: {
    "core-Hall Rental": "completed",
    "catering-In-house Catering": "not-required"
  },
  assignedContacts: {
    "core-Hall Rental": [
      { id: "1234567890", name: "John Doe", phone: "1234567890", role: "venue" }
    ]
  }
}
```

## Icon System
- All icons defined in `Icons` object
- SVG-based, inline in component
- Consistent sizing: w-5 h-5 for action buttons, w-6 h-6 for service status

## Color System (Tailwind)
- **Service Categories**: bg-blue-500, bg-green-500, bg-purple-500, bg-pink-500, bg-orange-500, bg-indigo-500, bg-cyan-500, bg-teal-500
- **Roles**: Same as categories plus bg-gray-500 for "Other"
- **Status**: green-500 (completed), red-500 (not required), gray-300 (pending)

## New Feature Guidelines

### When Adding New Services
1. Add to appropriate category in `SERVICES_DATA`
2. Include `deps` array (empty if no dependencies)
3. Ensure service name is unique within category

### When Adding New Roles
1. Add to `ROLE_OPTIONS` array
2. Include id, label, and color
3. Update role selection UI in ContactSelector

### When Adding New Categories
1. Add to `SERVICES_DATA` with title, color, and items
2. Choose a unique Tailwind color class
3. Add to expanded categories state initialization if should be open by default

## Performance Considerations
- Avoid unnecessary re-renders by proper state updates
- Use functional setState for updates based on previous state
- Memoize expensive calculations (progress calculation is acceptable as-is)
- LocalStorage operations are synchronous - keep updates minimal

## Accessibility
- All interactive elements should be keyboard accessible
- Use semantic HTML where possible
- Ensure color contrast meets WCAG AA standards
- Provide descriptive titles/labels for icon-only buttons

## Testing Checklist for New Features
- [ ] Works on mobile (iOS Safari and Android Chrome)
- [ ] Touch interactions are responsive
- [ ] Data persists after page reload
- [ ] Works offline (after first load)
- [ ] No console errors
- [ ] All buttons have adequate touch targets
- [ ] Modal closes properly on outside click
- [ ] State updates correctly in localStorage

## Common Patterns

### Adding a new modal
```javascript
const [modalOpen, setModalOpen] = useState(false);

// Modal component
if (!isOpen) return null;

return (
  <div className="fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center z-50" onClick={onClose}>
    <div className="bg-white rounded-lg p-6" onClick={(e) => e.stopPropagation()}>
      {/* Content */}
    </div>
  </div>
);
```

### Updating localStorage
```javascript
useEffect(() => {
  localStorage.setItem('eventManagerData', JSON.stringify({ 
    serviceStatuses, 
    assignedContacts 
  }));
}, [serviceStatuses, assignedContacts]);
```

### Creating unique keys
```javascript
const key = `${categoryKey}-${serviceName}`;
```

## Don'ts
- ❌ Don't add external dependencies (keep it single-file)
- ❌ Don't use class components
- ❌ Don't use complex state management libraries
- ❌ Don't break the single-file architecture
- ❌ Don't use hover states for primary interactions (mobile-first)
- ❌ Don't store sensitive data in localStorage

## Do's
- ✅ Keep components pure and functional
- ✅ Use Tailwind utility classes for styling
- ✅ Maintain mobile-first responsive design
- ✅ Add proper error handling
- ✅ Validate user inputs
- ✅ Use semantic variable names
- ✅ Comment complex logic
- ✅ Test on actual mobile devices

## Future Enhancement Ideas
- Export/import data as JSON
- Share event checklist via link
- Add due dates to services
- Calendar integration
- Push notifications for incomplete tasks
- Multi-event support
- Collaboration features
- Photo attachments for services
- Budget tracking per service
- Vendor rating system

---

## 📁 **How to Add This to Your Project**

### **Option 1: Via VS Code**

1. **Create the file:**
   ```bash
   # In VS Code Terminal
   mkdir -p .github
   touch .github/copilot-instructions.md
   ```

2. **Copy the content above** into `.github/copilot-instructions.md`

3. **Commit and push:**
   ```bash
   git add .github/copilot-instructions.md
   git commit -m "Add Copilot instructions"
   git push
   ```

### **Option 2: Manual Creation**

1. In your project folder, create a folder named `.github`
2. Inside `.github`, create a file named `copilot-instructions.md`
3. Paste the content above
4. Save and commit to GitHub

---

## 🎯 **What This Does**

This instructions file tells GitHub Copilot:
- ✅ Your project architecture and patterns
- ✅ Naming conventions to follow
- ✅ State management approach
- ✅ Mobile-first considerations
- ✅ Common patterns to reuse
- ✅ Testing checklist
- ✅ What to avoid

Now when you use Copilot, it will:
- Generate code consistent with your style
- Understand your data structures
- Follow mobile-first principles
- Maintain the single-file architecture
- Suggest improvements aligned with your patterns

---

**Want me to create any other documentation files like README.md or CONTRIBUTING.md?** 📚
