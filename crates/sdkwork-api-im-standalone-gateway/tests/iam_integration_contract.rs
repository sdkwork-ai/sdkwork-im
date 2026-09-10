#[test]
fn embedded_iam_preserves_router_manifest_framework_binding() {
    let source = include_str!("../src/main.rs");

    assert!(source.contains("bootstrap_iam_app_for_application"));
    // Composition flows through the module registry seam (main.rs holds
    // contributions in an ApiModuleRegistry and calls try_compose there);
    // ComposedApiAssembly remains the composed-result type. Match the two
    // halves separately so the assertion is newline-agnostic (CRLF/LF).
    let normalized = source.split_whitespace().collect::<Vec<_>>().join(" ");
    assert!(normalized.contains("module_registry .try_compose("));
    assert!(source.contains("ApiModuleRegistry::new()"));
    assert!(source.contains("vec![im_contribution, iam_contribution]"));
    assert!(!source.contains("iam_contribution.router"));
}
