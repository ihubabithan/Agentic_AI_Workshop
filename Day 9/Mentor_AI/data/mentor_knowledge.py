from langchain.schema import Document

MENTOR_KNOWLEDGE_BASE = [
    # Process Documents
    Document(
        page_content="""
        Simple Task Review Process:
        1. Check unit test coverage and passing status
        2. Verify code style and linting compliance
        3. Review basic functionality against requirements
        4. Look for obvious security or performance issues
        5. Validate documentation completeness
        
        These tasks typically take 15-30 minutes to review and can often be handled by peer reviewers.
        """,
        metadata={"type": "process", "complexity": "simple", "category": "review"}
    ),
    
    Document(
        page_content="""
        Complex Project Assessment Guidelines:
        1. Architecture review and system design validation
        2. Performance testing and scalability analysis
        3. Security audit and vulnerability assessment
        4. Integration testing and API contract validation
        5. Deployment strategy and rollback plans
        
        Complex tasks require senior mentor oversight and typically take 2-4 hours for thorough review.
        """,
        metadata={"type": "process", "complexity": "complex", "category": "assessment"}
    ),
    
    # Best Practices
    Document(
        page_content="""
        Peer Review Best Practices:
        1. Use constructive and encouraging language
        2. Focus on knowledge sharing, not criticism
        3. Provide specific examples and suggestions
        4. Reference documentation and standards
        5. Follow up on implementation changes
        
        Effective peer reviews build team knowledge and improve code quality.
        """,
        metadata={"type": "guidelines", "complexity": "moderate", "category": "best_practices"}
    ),
    
    # Escalation Criteria
    Document(
        page_content="""
        Senior Mentor Escalation Criteria:
        - System architecture or design changes
        - Performance-critical components
        - Security-sensitive features
        - Complex algorithm implementations
        - Cross-team impact changes
        - High-risk deployments
        
        When in doubt, escalate to ensure proper oversight.
        """,
        metadata={"type": "guidelines", "complexity": "complex", "category": "escalation"}
    ),
    
    # Common Patterns
    Document(
        page_content="""
        Common Submission Patterns and Solutions:
        1. Missing Tests: Provide template test cases
        2. Poor Documentation: Share documentation guidelines
        3. Overcomplicated Code: Suggest simplification strategies
        4. Performance Issues: Share optimization techniques
        5. Security Concerns: Reference security best practices
        
        Address patterns early to prevent recurring issues.
        """,
        metadata={"type": "patterns", "complexity": "moderate", "category": "solutions"}
    ),
    
    # Time Management
    Document(
        page_content="""
        Mentor Time Management Guidelines:
        - Simple tasks: 15-30 minutes review
        - Moderate tasks: 30-60 minutes review
        - Complex tasks: 2-4 hours review
        - Follow-ups: Schedule 15-minute check-ins
        - Team reviews: Plan 1-hour sessions
        
        Efficient time management ensures consistent mentor availability.
        """,
        metadata={"type": "guidelines", "complexity": "moderate", "category": "time_management"}
    )
] 