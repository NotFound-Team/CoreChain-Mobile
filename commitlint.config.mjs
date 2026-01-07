const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "test",
        "chore",
        "perf",
        "ci",
        "build",
        "revert",
      ],
    ],
    "header-max-length": [2, "always", 150],
    "subject-case": [2, "never", ["start-case", "pascal-case", "upper-case"]],
  },
};

// type(scope?): subject

export default config;
