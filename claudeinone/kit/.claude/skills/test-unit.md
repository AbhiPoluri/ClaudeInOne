# Unit Testing

Write isolated tests for individual functions and components using Jest and Vitest.

## Jest Setup

```bash
npm install -D jest @types/jest ts-jest
npx jest --init
```

## Basic Tests

```typescript
describe('Calculator', () => {
  test('adds two numbers', () => {
    const add = (a: number, b: number) => a + b;
    expect(add(2, 3)).toBe(5);
  });

  test('throws error on invalid input', () => {
    expect(() => {
      const divide = (a: number, b: number) => {
        if (b === 0) throw new Error('Division by zero');
        return a / b;
      };
      divide(10, 0);
    }).toThrow('Division by zero');
  });
});
```

## Testing Async Functions

```typescript
test('fetches user data', async () => {
  const fetchUser = async (id: number) => {
    const res = await fetch(`/api/users/${id}`);
    return res.json();
  };

  // Using async/await
  const user = await fetchUser(1);
  expect(user.name).toBe('John');

  // Or using .then()
  return fetchUser(1).then((user) => {
    expect(user.email).toBe('john@example.com');
  });
});
```

## Mocking

```typescript
// Mock entire module
jest.mock('./api', () => ({
  fetchUser: jest.fn().mockResolvedValue({ id: 1, name: 'John' })
}));

// Mock specific function
const mockFn = jest.fn((x) => x * 2);
expect(mockFn(3)).toBe(6);
expect(mockFn).toHaveBeenCalledWith(3);
expect(mockFn).toHaveBeenCalledTimes(1);
```

## React Component Tests

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  const button = screen.getByRole('button', { name: /click me/i });
  expect(button).toBeInTheDocument();
});

test('calls onClick handler', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click</Button>);

  screen.getByRole('button').click();
  expect(handleClick).toHaveBeenCalled();
});
```

## Test Coverage

```bash
# Run with coverage report
jest --coverage

# Generate HTML report
jest --coverage --coverageReporters=html
```

## Best Practices

✅ **Arrange-Act-Assert** - Setup, execute, verify
✅ **One assertion per test** - Keep tests focused
✅ **Descriptive names** - Use clear test descriptions
✅ **Avoid test interdependencies** - Each test independent
✅ **Mock external dependencies** - Don't test third-party code

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/)

## Core Patterns & Implementations

### Key Concepts
- Industry standards and best practices
- Proven architectural patterns
- Performance optimization techniques
- Security-first development approach
- Testing and quality assurance

### Common Use Cases
- Building production applications
- Solving complex technical problems
- Optimizing performance and scalability
- Implementing security best practices
- Team collaboration and knowledge transfer

## Implementation Guide

### Setup & Configuration
- Framework/tool initialization
- Environment setup
- Configuration best practices
- Development vs production settings

### Code Examples
- Real-world patterns and solutions
- Integration with other tools
- Error handling approaches
- Performance optimization

### Architecture Patterns
- Proven design patterns
- Component organization
- Data flow and state management
- Scalability considerations

## Best Practices

1. **Code Quality** — Follow conventions, write clean code
2. **Performance** — Profile and optimize bottlenecks
3. **Security** — Implement security-first practices
4. **Testing** — Comprehensive test coverage
5. **Documentation** — Clear, maintainable documentation
6. **Monitoring** — Track health and metrics
7. **Scalability** — Design for growth

## Testing Strategies

- Unit testing fundamentals
- Integration testing approaches
- End-to-end testing patterns
- Performance testing methods
- Security testing checklist

## Performance Considerations

- Optimization techniques
- Caching strategies
- Database optimization
- API performance
- Front-end performance
- Monitoring and profiling

## Security Checklist

- Input validation and sanitization
- Authentication and authorization
- Data encryption
- Secure dependencies
- Common vulnerability patterns
- Security headers and configuration

## Deployment & Operations

- Preparation for production
- Deployment strategies
- Rollback procedures
- Monitoring and alerting
- Logging and debugging
- Incident response

## Integration Points

Works seamlessly with:
- Related technologies and frameworks
- Development and deployment tools
- Monitoring and observability
- Security and compliance tools

## Tools & Technologies

- Popular frameworks and libraries
- Development utilities
- Testing frameworks
- Deployment platforms
- Monitoring solutions

## Common Pitfalls to Avoid

- Premature optimization
- Ignoring security requirements
- Insufficient testing
- Poor error handling
- Technical debt accumulation
- Monolithic approaches
- Lack of monitoring

## Learning Path

1. Understand core concepts
2. Study best practices
3. Review real-world examples
4. Build sample projects
5. Apply in production
6. Mentor others
7. Stay current

## Advanced Topics

- Optimization strategies
- Distributed systems
- High-availability patterns
- Advanced security
- Performance at scale
- Cloud-native patterns

## Resources

- Official documentation
- Community guides and tutorials
- Best practices and patterns
- Example implementations
- Performance optimization guides
- Security hardening resources
- Case studies and real-world examples

## Success Criteria

✅ Implementation follows best practices
✅ Code is clean and maintainable
✅ Performance is optimized
✅ Security requirements met
✅ Tests provide good coverage
✅ Documentation is complete
✅ Monitoring and alerting configured
✅ Deployment is smooth and safe

## When to Use This Skill

Apply this skill when:
- Building production applications
- Solving complex problems
- Optimizing performance
- Implementing security
- Making architectural decisions
- Training team members
- Reviewing code quality

## Integration with Other Skills

This skill complements:
- Related framework/tool skills
- Architecture pattern skills
- Testing and quality skills
- DevOps and deployment skills
- Security and compliance skills

## Version Notes

- Latest stable releases
- Feature deprecations
- Migration guides
- Breaking changes
- Upgrade paths

## Community & Support

- Official forums and discussions
- Community Slack/Discord channels
- Stack Overflow resources
- GitHub discussions
- Blog posts and articles

## Roadmap & Future

- Upcoming features
- Planned improvements
- Community contributions
- Performance roadmap
- Security improvements
